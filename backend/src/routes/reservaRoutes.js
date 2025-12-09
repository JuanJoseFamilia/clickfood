// backend/src/routes/reservaRoutes.js
import express from 'express';
import { 
    obtenerReservas, 
    obtenerReservaPorId, 
    crearReserva, 
    actualizarReserva, 
    eliminarReserva 
} from '../controllers/reservaController.js';

const router = express.Router();

// GET /reservas
router.get('/', obtenerReservas);

// GET /reservas/:id
router.get('/:id', obtenerReservaPorId);

// POST /reservas
router.post('/', crearReserva);

// PUT /reservas/:id
router.put('/:id', actualizarReserva);

// DELETE /reservas/:id
router.delete('/:id', eliminarReserva);

export default router;