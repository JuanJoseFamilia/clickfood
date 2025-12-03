import { Router } from 'express';
import {
    obtenerPedidos,
    crearPedido,
    actualizarPedido,
    eliminarPedido,
    obtenerPedidoPorId,
    obtenerDetallesPedido 
} from '../controllers/pedidoController.js';

const router = Router();

router.get('/', obtenerPedidos);
router.post('/', crearPedido);
router.get('/:id/detalle', obtenerDetallesPedido); 
router.get('/:id', obtenerPedidoPorId);
router.put('/:id', actualizarPedido);
router.delete('/:id', eliminarPedido);

export default router;