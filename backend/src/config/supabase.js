// Importamos con sintaxis CommonJS
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

// Cargar el archivo .env desde la raiz
dotenv.config({ path: "./.env" });

const supabaseUrl = process.env.supabaseUrl;
const supabaseKey = process.env.supabaseKey;

if (!supabaseUrl || !supabaseKey) {
  console.error("No se encontraron las variables supabaseUrl o supabaseKey");
  console.log("Valor supabaseUrl:", supabaseUrl);
  console.log("Valor supabaseKey:", supabaseKey ? "Oculto por seguridad" : "No definida");
  process.exit(1);
}

// Creamos el cliente
const supabase = createClient(supabaseUrl, supabaseKey);

// --- CAMBIO AQUÍ ---
// Exportamos un objeto que CONTIENE el cliente
// para que const { supabase } = require(...) funcione
module.exports = { supabase };
