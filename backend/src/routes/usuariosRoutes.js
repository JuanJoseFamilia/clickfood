import express from 'express';
import Usuario from '../models/usuario.js'; 

import {
  getAllUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  registrarUsuario,
} from '../controllers/usuarioController.js';

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    const usuario = await Usuario.buscarPorEmail(email);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }


    const hashGuardado = usuario.contraseña || usuario.password;
    const passwordValido = await Usuario.verificarPassword(contraseña, hashGuardado);

    if (!passwordValido) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const usuarioResponse = { ...usuario };
    delete usuarioResponse.contraseña;
    delete usuarioResponse.password;


    res.json({
      mensaje: 'Login exitoso',
      usuario: usuarioResponse
    });

  } catch (error) {
    console.error("Error en Login:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post("/register", registrarUsuario);

router.route('/')
  .get(getAllUsuarios)
  .post(registrarUsuario);

router.route('/:id')
  .get(getUsuarioById)
  .put(updateUsuario)
  .delete(deleteUsuario);

export default router;