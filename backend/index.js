// src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./src/routes/usuarios.js";

dotenv.config({ path: "./.env" });

const app = express();
app.use(cors());
app.use(express.json());

app.use("/usuarios", router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

