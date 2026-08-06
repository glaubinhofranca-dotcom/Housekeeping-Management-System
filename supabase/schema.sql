-- ========================================================
-- HOUSEKEEPER PRO - SCHEMA E POLÍTICAS DE SEGURANÇA (RLS)
-- ========================================================

-- 1. Tabela de Perfis
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'housekeeper' CHECK (role IN ('admin', 'supervisor', 'housekeeper')),
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Quartos
CREATE TABLE IF NOT EXISTS public.rooms (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  floor INT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  priority INT NOT NULL,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes TEXT DEFAULT '',
  guest_name TEXT,
  checkin_time TEXT,
  beds INT DEFAULT 1,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Histórico e Auditoria de Quartos (Audit Trail)
CREATE TABLE IF NOT EXISTS public.room_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  old_status TEXT,
  new_status TEXT,
  old_assigned_to UUID,
  new_assigned_to UUID,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_history ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- FUNÇÕES DE CHECAGEM DE FUNÇÃO (SECURITY DEFINER - EVITA RECURSÃO)
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin_or_supervisor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'supervisor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --------------------------------------------------------
-- POLÍTICAS DE SEGURANÇA DA TABELA PROFILES (SEM RECURSÃO)
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Usuários autenticados podem ver perfis" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar o próprio nome" ON public.profiles;
DROP POLICY IF EXISTS "Admins possuem controle total de perfis" ON public.profiles;
DROP POLICY IF EXISTS "Allow all ops on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Leitura de perfis para autenticados" ON public.profiles;
DROP POLICY IF EXISTS "Inserção de perfis" ON public.profiles;
DROP POLICY IF EXISTS "Atualização de perfis" ON public.profiles;
DROP POLICY IF EXISTS "Exclusão de perfis por admin" ON public.profiles;

CREATE POLICY "Leitura de perfis para autenticados"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Inserção de perfis"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id OR public.is_admin());

CREATE POLICY "Atualização de perfis"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Exclusão de perfis por admin"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- --------------------------------------------------------
-- POLÍTICAS DE SEGURANÇA DA TABELA ROOMS
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Usuários autenticados podem ler quartos" ON public.rooms;
DROP POLICY IF EXISTS "Camareiras podem atualizar status dos quartos" ON public.rooms;
DROP POLICY IF EXISTS "Apenas admins/supervisores podem deletar/criar quartos" ON public.rooms;
DROP POLICY IF EXISTS "Allow all ops on rooms" ON public.rooms;
DROP POLICY IF EXISTS "Leitura de quartos para autenticados" ON public.rooms;
DROP POLICY IF EXISTS "Atualização de quartos para autenticados" ON public.rooms;
DROP POLICY IF EXISTS "Escrita e exclusão de quartos por admin/supervisor" ON public.rooms;

CREATE POLICY "Leitura de quartos para autenticados"
  ON public.rooms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Atualização de quartos para autenticados"
  ON public.rooms FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Escrita e exclusão de quartos por admin/supervisor"
  ON public.rooms FOR ALL
  TO authenticated
  USING (public.is_admin_or_supervisor());

-- --------------------------------------------------------
-- POLÍTICAS DE SEGURANÇA DA TABELA ROOM_HISTORY
-- --------------------------------------------------------
DROP POLICY IF EXISTS "Usuários autenticados podem ver histórico" ON public.room_history;
CREATE POLICY "Usuários autenticados podem ver histórico"
  ON public.room_history FOR SELECT
  TO authenticated
  USING (true);

-- --------------------------------------------------------
-- REALTIME (VERIFICAÇÃO IDEMPOTENTE)
-- --------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'rooms'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  END IF;
END $$;

-- --------------------------------------------------------
-- TRIGGERS AUTOMÁTICOS
-- --------------------------------------------------------

-- Trigger 1: Sincronizar novos usuários do Supabase Auth com profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'housekeeper'),
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger 2: Auditoria automática de alterações nos quartos
CREATE OR REPLACE FUNCTION public.log_room_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF (OLD.status IS DISTINCT FROM NEW.status) OR (OLD.assigned_to IS DISTINCT FROM NEW.assigned_to) THEN
    INSERT INTO public.room_history (
      room_id,
      changed_by,
      old_status,
      new_status,
      old_assigned_to,
      new_assigned_to,
      notes
    ) VALUES (
      NEW.id,
      auth.uid(),
      OLD.status,
      NEW.status,
      OLD.assigned_to,
      NEW.assigned_to,
      NEW.notes
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_room_updated ON public.rooms;
CREATE TRIGGER on_room_updated
  AFTER UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.log_room_changes();
