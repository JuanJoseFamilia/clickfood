// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";


import usuariosRoutes from "./src/routes/usuariosRoutes.js";
import productoRoutes from './src/routes/productoRoutes.js';
import orderRoutes from './src/routes/pedidoRoutes.js';
import reservaRoutes from './src/routes/reservaRoutes.js';
import clienteRoutes from './src/routes/clienteRoutes.js';
import mesaRoutes from './src/routes/mesaRoutes.js';
import empleadoRoutes from './src/routes/empleadoRoutes.js';
import predictionRoutes from './src/routes/predictionRoutes.js';

dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ mensaje: "API ClickFood funcionando" });
});

app.use("/usuarios", usuariosRoutes);
app.use("/productos", productoRoutes);
app.use("/pedidos", orderRoutes);
app.use("/reservas", reservaRoutes);
app.use("/clientes", clienteRoutes);
app.use("/mesas", mesaRoutes);
app.use("/empleados", empleadoRoutes);
app.use('/api/predictions', predictionRoutes);

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
    console.log(`[AI]    GET  http://localhost:${PORT}/api/predictions/health`);     
    console.log(`[AI]    POST http://localhost:${PORT}/api/predictions/train/:id`);  
    console.log(`[AI]    GET  http://localhost:${PORT}/api/predictions/:id/week`);   
    console.log("-----------------------------------------");
});