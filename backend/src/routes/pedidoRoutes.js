import { Router } from 'express';
import {
    obtenerPedidos,
    crearPedido,
    actualizarPedido,
    eliminarPedido,
    obtenerPedidoPorId,
    obtenerDetallesPedido,
    obtenerPedidosCocina,
    actualizarEstadoPedido 
} from '../controllers/pedidoController.js';

const router = Router();

router.get("/cocina", obtenerPedidosCocina); 

router.get('/', obtenerPedidos);
router.post('/', crearPedido);

router.get('/:id/detalle', obtenerDetallesPedido); 
router.get('/:id', obtenerPedidoPorId);

router.put('/:id', actualizarEstadoPedido); 

router.delete('/:id', eliminarPedido);

export default router;