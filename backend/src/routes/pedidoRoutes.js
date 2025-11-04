import { Router } from 'express';

import {
    obtenerPedidos,
    crearPedido,
    actualizarPedido,
    eliminarPedido,
    obtenerPedidoPorId
} from '../controllers/pedidoController.js';

const router = Router();

// GET /pedidos
router.get('/', obtenerPedidos); 

// POST /pedidos
router.post('/', crearPedido); 


// GET /pedidos/:id
router.get('/:id', obtenerPedidoPorId); 

// PATCH /pedidos/:id 
router.patch('/:id', actualizarPedido); 

// DELETE /pedidos/:id
router.delete('/:id', eliminarPedido); 

export default router;
