// backend/src/routes/mesaRoutes.js
import express from 'express';
const router = express.Router();

import * as mesaController from '../controllers/mesaController.js';

router.route('/')
  .get(mesaController.obtenerMesas)
  .post(mesaController.crearMesa);

router.route('/:id')
  .get(mesaController.obtenerMesaPorId)
  .put(mesaController.actualizarMesa)
  .delete(mesaController.eliminarMesa);

export default router;
