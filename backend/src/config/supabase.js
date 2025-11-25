// backend/src/config/supabase.js
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Cargar el archivo .env desde la raiz
dotenv.config();

const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.supabaseKey;

if (!supabaseUrl || !supabaseKey) {
  console.error("No se encontraron las variables supabaseUrl o supabaseKey");
  process.exit(1);
}

// Creamos el cliente
export const supabase = createClient(supabaseUrl, supabaseKey);