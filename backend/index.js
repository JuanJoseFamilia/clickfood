import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// --- 1. IMPORTA TODAS TUS RUTAS ---
import usuariosRouter from "./src/routes/usuarios.js";
import productRoutes from './src/routes/productoRoutes.js';
import orderRoutes from './src/routes/pedidoRoutes.js';
import reservaRoutes from './src/routes/reservaRoutes.js';
import clienteRoutes from './src/routes/clienteRoutes.js';
import mesaRoutes from './src/routes/mesaRoutes.js'; // El nombre del archivo debe ser el que importaste
import empleadoRoutes from './src/routes/empleadoRoutes.js'; 


dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ mensaje: "API ClickFood funcionando" });
});

// --- 2. USA TODAS TUS RUTAS ---
// Tus rutas de usuario (Ej: /usuarios/login y /usuarios para CRUD)
app.use("/usuarios", usuariosRouter);

// --- ¡CORRECCIÓN AQUÍ! ---
// El prefijo de la ruta DEBE COINCIDIR con el 'endpoint' del dashboard
app.use("/productos", productRoutes);
app.use("/pedidos", orderRoutes);
app.use("/reservas", reservaRoutes);
app.use("/clientes", clienteRoutes);
app.use("/mesas", mesaRoutes); 
app.use("/empleados", empleadoRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
    console.log("--- Endpoints de la API disponibles ---");
    console.log(`[AUTH]  POST http://localhost:${PORT}/usuarios/login`);
    console.log(`[PROD]  GET  http://localhost:${PORT}/productos`);
    console.log(`[PED]   GET  http://localhost:${PORT}/pedidos`);
    console.log(`[RES]   GET  http://localhost:${PORT}/reservas`);
    console.log(`[CLI]   GET  http://localhost:${PORT}/clientes`);
    console.log(`[MESA]  GET  http://localhost:${PORT}/mesas`);
    console.log(`[EMP]   GET  http://localhost:${PORT}/empleados`);
    console.log("-----------------------------------------");
});

app.use("/", productRoutes);
app.use("/", orderRoutes);
app.use("/", reservaRoutes);
app.use("/", clienteRoutes);
app.use("/", mesaRoutes);
app.use("/", empleadoRoutes);

app.use("/productos", productRoutes);
app.use("/pedidos", orderRoutes);
app.use("/reservas", reservaRoutes);
app.use("/clientes", clienteRoutes);
app.use("/mesas", mesaRoutes);
app.use("/empleados", empleadoRoutes);

