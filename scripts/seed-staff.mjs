// Script para criar ou verificar contas no Supabase Auth + profiles.
// Uso: DEFAULT_PASSWORD='SuaSenhaAqui123!' node scripts/seed-staff.mjs
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://vlqjlxiaikifcoibozof.supabase.co'
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_HD-MxNGXGRzX9uMiSARvIA_C21DWYU7'

const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD
if (!DEFAULT_PASSWORD) {
  console.error('⚠️ Defina a variável DEFAULT_PASSWORD antes de rodar o script.')
  console.error('Exemplo: DEFAULT_PASSWORD="MinhaSenha123!" node scripts/seed-staff.mjs')
  process.exit(1)
}

const STAFF = [
  { name: 'Glauber', role: 'admin', email: 'engineering@home2franklin.com' },
  { name: 'Mackenzie', role: 'admin', email: 'mackenziesherlock@home2franklin.co' },
  { name: 'Raquel', role: 'supervisor', email: 'raquelartheiro@home2franklin.com' },
  { name: 'Anne', role: 'supervisor', email: 'anne@home2franklin.com' },
  { name: 'Alexandra', role: 'housekeeper', email: 'alexandra@home2franklin.com' },
  { name: 'Emilia', role: 'housekeeper', email: 'emilia@home2franklin.com' },
  { name: 'Eronildo', role: 'housekeeper', email: 'eronildo@home2franklin.com' },
  { name: 'Maristela', role: 'housekeeper', email: 'maristela@home2franklin.com' },
  { name: 'Gabriel', role: 'housekeeper', email: 'gabriel@home2franklin.com' },
  { name: 'Marcia', role: 'housekeeper', email: 'marcia@home2franklin.com' },
  { name: 'Rodrigo', role: 'housekeeper', email: 'rodrigo@home2franklin.com' },
  { name: 'Gabriela', role: 'housekeeper', email: 'gabriela@home2franklin.com' },
]

const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
})

console.log('🔄 Verificando e registrando contas no Supabase Auth...\n')

for (const person of STAFF) {
  const { data, error } = await client.auth.signUp({
    email: person.email,
    password: DEFAULT_PASSWORD,
    options: { data: { name: person.name, role: person.role } },
  })

  if (error) {
    if (error.message.toLowerCase().includes('registered')) {
      console.log(`ℹ️ ${person.email} já está registrado no Auth. Para redefinir a senha deste usuário, execute o comando SQL de redefinição no Supabase SQL Editor.`)
    } else {
      console.error(`✗ ${person.email}: ${error.message}`)
    }
    continue
  }

  if (!data.user) {
    console.error(`✗ ${person.email}: nenhum usuário retornado`)
    continue
  }

  const { error: profileErr } = await client.from('profiles').upsert({
    id: data.user.id,
    name: person.name,
    role: person.role,
    email: person.email,
  })

  if (profileErr) {
    console.error(`✗ ${person.email}: erro ao criar perfil: ${profileErr.message}`)
  } else {
    console.log(`✓ ${person.name} (${person.role}) — ${person.email} criado com sucesso!`)
  }
}
