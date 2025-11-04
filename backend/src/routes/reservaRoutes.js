import { Router } from 'express';
// Importamos el controlador de reservas
import {
    obtenerReservas,
    crearReserva,
    actualizarReserva, // <- Esta función se llama con PATCH
    eliminarReserva,
    obtenerReservaPorId
} from '../controllers/reservaController.js';

const router = Router();

// Rutas a la raíz /reservas
router.get('/', obtenerReservas);
router.post('/', crearReserva);

// CORRECCIÓN: Cambiamos PUT a PATCH
router.patch('/:id', actualizarReserva); // PATCH /reservas/:id 

router.delete('/:id', eliminarReserva);
router.get('/:id', obtenerReservaPorId);

export default router;
