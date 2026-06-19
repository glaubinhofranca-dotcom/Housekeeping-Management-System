// One-off script to bulk-create staff accounts (Supabase Auth + profiles row).
// Usage: DEFAULT_PASSWORD='yourpassword' node scripts/seed-staff.mjs
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vlqjlxiaikifcoibozof.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_HD-MxNGXGRzX9uMiSARvIA_C21DWYU7'

const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD
if (!DEFAULT_PASSWORD) {
  console.error('Set DEFAULT_PASSWORD env var before running this script.')
  process.exit(1)
}

const STAFF = [
  { name: 'Anne', role: 'supervisor', email: 'anne@home2franklin.com' },
  { name: 'Alexandra', role: 'housekeeper', email: 'alexandra@home2franklin.com' },
  { name: 'Emilia', role: 'housekeeper', email: 'emilia@home2franklin.com' },
  { name: 'Eronildo', role: 'housekeeper', email: 'eronildo@home2franklin.com' },
  { name: 'Gabriela', role: 'housekeeper', email: 'gabriela@home2franklin.com' },
  { name: 'Marcia', role: 'housekeeper', email: 'marcia@home2franklin.com' },
  { name: 'Maristela', role: 'housekeeper', email: 'maristela@home2franklin.com' },
  { name: 'Rodrigo', role: 'housekeeper', email: 'rodrigo@home2franklin.com' },
  { name: 'Gabriel', role: 'housekeeper', email: 'gabriel@home2franklin.com' },
]

const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
})

for (const person of STAFF) {
  const { data, error } = await client.auth.signUp({
    email: person.email,
    password: DEFAULT_PASSWORD,
    options: { data: { name: person.name, role: person.role } },
  })

  if (error) {
    console.error(`✗ ${person.email}: ${error.message}`)
    continue
  }
  if (!data.user) {
    console.error(`✗ ${person.email}: no user returned`)
    continue
  }

  const { error: profileErr } = await client.from('profiles').upsert({
    id: data.user.id,
    name: person.name,
    role: person.role,
    email: person.email,
  })

  if (profileErr) {
    console.error(`✗ ${person.email}: profile failed — ${profileErr.message}`)
  } else {
    console.log(`✓ ${person.name} (${person.role}) — ${person.email}`)
  }
}
