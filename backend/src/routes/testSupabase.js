// backend/testSupabase.js
import { supabase } from '../config/supabaseClient.js'


async function testConnection() {
  try {
    const { data, error } = await supabase.from('usuarios').select('*').limit(1)
    if (error) {
      console.error('❌ Error al conectar a Supabase:', error.message)
    } else {
      console.log('✅ Conexión exitosa. Datos de prueba:', data)
    }
  } catch (err) {
    console.error('❌ Error inesperado:', err)
  }
}

testConnection()
