// backend/src/routes/empleadoRoutes.js
import express from 'express';
import * as empleadoController from '../controllers/empleadoController.js';

const router = express.Router();

// GET /
router.route('/')
    .get(empleadoController.obtenerEmpleados)
    .post(empleadoController.crearEmpleado);

// GET /:id
router.route('/:id')
    .get(empleadoController.obtenerEmpleadoPorId)
    .put(empleadoController.actualizarEmpleado)
    .delete(empleadoController.eliminarEmpleado);

export default router;
