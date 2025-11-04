import { Router } from 'express';

import { 
    obtenerProductos, 
    crearProducto, 
    actualizarProducto, 
    eliminarProducto,
    obtenerProductoPorId 
} from '../controllers/productoController.js'; 


const router = Router();


// Corresponde a: GET /api/productos
router.get('/productos', obtenerProductos);


// Corresponde a: POST /api/productos
router.post('/productos', crearProducto);


// Corresponde a: PUT /api/productos/:id
router.put('/productos/:id', actualizarProducto);


// Corresponde a: DELETE /api/productos/:id
router.delete('/productos/:id', eliminarProducto);


// Corresponde a: GET /api/productos/:id
router.get('/productos/:id', obtenerProductoPorId);

export default router;