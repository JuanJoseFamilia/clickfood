// backend/src/routes/productoRoutes.js
import { Router } from 'express';

import {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductoPorId
} from '../controllers/productoController.js';

const router = Router();

router.get('/', obtenerProductos);  // GET /productos     
router.post('/', crearProducto);        // POST /productos    
router.get('/:id', obtenerProductoPorId);    // GET /productos/:id
router.put('/:id', actualizarProducto);    // PUT /productos/:id
router.delete('/:id', eliminarProducto);     // DELETE /productos/:id

export default router;