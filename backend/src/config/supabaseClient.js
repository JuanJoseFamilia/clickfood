// backend/src/config/supabaseClient.js
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Cargar el archivo .env desde la raiz
dotenv.config({ path: "./.env" });

const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.supabaseKey;

if (!supabaseUrl || !supabaseKey) {
  console.error("No se encontraron las variables SUPABASE_URL o SUPABASE_KEY");
  console.log("Valor SUPABASE_URL:", supabaseUrl);
  console.log("Valor SUPABASE_KEY:", supabaseKey ? "Oculto por seguridad" : "No definida");
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
