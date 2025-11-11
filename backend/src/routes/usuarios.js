// backend/src/routes/usuarios.js
import express from 'express';
import {
  getAllUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  registrarUsuario,
  loginUsuario
} from '../controllers/usuarioController.js';

const router = express.Router();


router.post("/register", registrarUsuario);
router.post("/login", loginUsuario);


router.route('/')
  .get(getAllUsuarios)  // GET /usuarios
  .post(registrarUsuario);  // POST /usuarios


router.route('/:id')
  .get(getUsuarioById) // GET /:id
  .put(updateUsuario) // PUT /:id
  .delete(deleteUsuario); // DELETE /:id

export default router;