import express from 'express';
import Usuario from '../models/usuario.js'; 

import {
  getAllUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  registrarUsuario,
  loginUsuario,
} from '../controllers/usuarioController.js';

const router = express.Router();

router.post("/login", loginUsuario);

router.post("/register", registrarUsuario);

router.route('/')
  .get(getAllUsuarios)
  .post(registrarUsuario);

router.route('/:id')
  .get(getUsuarioById)
  .put(updateUsuario)
  .delete(deleteUsuario);

export default router;