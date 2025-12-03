// backend/src/config/supabase.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log("--- CONFIG SUPABASE ---");
console.log("URL:", supabaseUrl ? "Cargada OK" : "Falta URL");
console.log("KEY:", supabaseKey ? "Cargada OK (Service Role)" : "Falta KEY");
console.log("-----------------------");

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Faltan las credenciales de Supabase en el archivo .env");
}

export const supabase = createClient(supabaseUrl, supabaseKey);