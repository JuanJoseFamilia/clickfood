import { Router } from 'express';
// Asegúrate de que las importaciones coincidan con tu controlador
import {
    obtenerClientes,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    obtenerClientePorId
} from '../controllers/clienteController.js';

const router = Router();

// --- CORRECCIÓN CLAVE: RUTAS BASE PRIMERO (GET y POST /clientes) ---
router.route('/')
  .get(obtenerClientes) // GET /
  .post(crearCliente); // POST /

// --- RUTAS DINÁMICAS DESPUÉS (/:id) ---
router.route('/:id')
  .get(obtenerClientePorId) // GET /:id
  .patch(actualizarCliente) // Usamos PATCH para sincronizar con el dashboard
  .delete(eliminarCliente); // DELETE /:id

export default router;
