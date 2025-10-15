// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usuariosRouter from "./src/routes/usuarios.js";

dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ mensaje: "API ClickFood funcionando ✅" });
});

app.use("/usuarios", usuariosRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Servidor en http://localhost:${PORT}`);
    console.log(`📍 POST http://localhost:${PORT}/usuarios/login`);
});