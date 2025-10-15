// src/routes/usuarios.js
import express from "express";
import { registrarUsuario } from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/register", registrarUsuario);

export default router;

