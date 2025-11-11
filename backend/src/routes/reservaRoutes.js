// backend/src/routes/reservaRoutes.js
import { Router } from 'express';

import {
    obtenerReservas,
    crearReserva,
    actualizarReserva,
    eliminarReserva,
    obtenerReservaPorId
} from '../controllers/reservaController.js';

const router = Router();

// Rutas a la raíz /reservas
router.get('/', obtenerReservas);  // GET /reservas
router.post('/', crearReserva);  // POST /reservas
// fix: Cambiamos PATCH a  PUT
router.put('/:id', actualizarReserva);// PUT /reservas/:id
router.delete('/:id', eliminarReserva);// DELETE /reservas/:id
router.get('/:id', obtenerReservaPorId);// GET /reservas/:id

export default router;
