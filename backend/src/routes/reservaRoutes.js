// backend/src/routes/reservaRoutes.js
import express from 'express';
// Importamos las funciones del controlador que ya contienen la lógica del JOIN y mapeo
import { 
    obtenerReservas, 
    obtenerReservaPorId, 
    crearReserva, 
    actualizarReserva, 
    eliminarReserva 
} from '../controllers/reservaController.js';

const router = express.Router();

// --- RUTAS CONECTADAS AL CONTROLADOR ---

// GET /reservas - Usará obtenerReservas del controlador (que incluye el nombre_cliente)
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