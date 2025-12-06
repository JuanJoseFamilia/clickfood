// backend/src/routes/dashboardRoutes.js
import { Router } from 'express';
import {
    obtenerEstadisticasDelDia,
    obtenerVentasDiarias,
    obtenerProductosMasVendidos,
    obtenerCategoriasMasVendidas,
    obtenerProximasReservas,
    obtenerUltimosMovimientos
} from '../controllers/dashboardController.js';

const router = Router();

// Estadísticas principales del dashboard
router.get('/estadisticas', obtenerEstadisticasDelDia);

// Ventas diarias (últimos 7 días)
router.get('/ventas-diarias', obtenerVentasDiarias);

// Productos más vendidos
router.get('/productos-mas-vendidos', obtenerProductosMasVendidos);

// Categorías más vendidas
router.get('/categorias-mas-vendidas', obtenerCategoriasMasVendidas);

// Próximas reservas
router.get('/proximas-reservas', obtenerProximasReservas);

// Últimos movimientos
router.get('/ultimos-movimientos', obtenerUltimosMovimientos);

export default router;
