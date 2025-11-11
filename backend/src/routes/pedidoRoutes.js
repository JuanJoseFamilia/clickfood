// backend/src/routes/pedidoRoutes.js
import { Router } from 'express';

import {
    obtenerPedidos,
    crearPedido,
    actualizarPedido,
    eliminarPedido,
    obtenerPedidoPorId
} from '../controllers/pedidoController.js';

const router = Router();


router.get('/', obtenerPedidos);// GET /pedidos
router.post('/', crearPedido);// POST /pedidos
router.get('/:id', obtenerPedidoPorId);// GET /pedidos/:id
router.put('/:id', actualizarPedido);// PUT /pedidos/:id
router.delete('/:id', eliminarPedido);// DELETE /pedidos/:id

export default router;
