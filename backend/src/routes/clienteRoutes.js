// backend/src/routes/clienteRoutes.js
import { Router } from 'express';

import {
    obtenerClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    obtenerClientePorId
} from '../controllers/clienteController.js';

const router = Router();

// --- CORRECCIÓN CLAVE: RUTAS BASE  (GET y POST /clientes) ---
router.route('/')
    .get(obtenerClientes) // GET /
    .post(crearCliente); // POST /

// --- RUTAS DINÁMICAS (/:id) ---
router.route('/:id')
    .get(obtenerClientePorId) // GET /:id
    .put(actualizarCliente) // PUT /:id
    .delete(eliminarCliente); // DELETE /:id

export default router;
