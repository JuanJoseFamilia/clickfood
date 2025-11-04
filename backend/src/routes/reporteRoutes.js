import { Router } from 'express';

// Importamos la conexión a Supabase (con la sintaxis corregida)
const { supabase } = require('../config/supabase.js');

const router = Router();

// (Simulación de base de datos)
let reportesSimulados = [
    { id_reporte: 1, tipo: "Ventas", fecha: new Date().toISOString(), datos: { total: 1500, pedidos: 20 } },
    { id_reporte: 2, tipo: "Inventario", fecha: new Date().toISOString(), datos: { bajo_stock: ["Papas", "Carne"] } }
];

// GET /reportes
router.get('/reportes', async (req, res) => {
    try {
        res.status(200).json(reportesSimulados);

    } catch (error) {
        console.error("--- ERROR EN OBTENER REPORTES ---", error);
        res.status(500).json({ message: 'Error al obtener reportes', error: error.message });
    }
});

// POST /reportes
router.post('/reportes', async (req, res) => {
    try {
        const { tipo, fecha, datos } = req.body;
        

        // Versión Simulada
        const nuevoReporte = { id_reporte: reportesSimulados.length + 1, ...req.body };
        reportesSimulados.push(nuevoReporte);
        res.status(201).json(nuevoReporte);

    } catch (error) {
        console.error("--- ERROR EN CREAR REPORTE ---", error);
        res.status(500).json({ message: 'Error al crear reporte', error: error.message });
    }
});

// PUT /reportes/:id
router.put('/reportes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, fecha, datos } = req.body;

        // Versión Simulada 
        let reporte = reportesSimulados.find(r => r.id_reporte == id);
        if (!reporte) return res.status(404).json({ message: "Reporte no encontrado" });
        reporte.tipo = tipo || reporte.tipo;
        reporte.fecha = fecha || reporte.fecha;
        reporte.datos = datos || reporte.datos;
        res.status(200).json(reporte);

    } catch (error) {
        console.error("--- ERROR EN ACTUALIZAR REPORTE ---", error);
        res.status(500).json({ message: 'Error al actualizar reporte', error: error.message });
    }
});

// DELETE /reportes/:id
router.delete('/reportes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Versión Simulada 
        reportesSimulados = reportesSimulados.filter(r => r.id_reporte != id);
        res.status(204).send();

    } catch (error) {
        console.error("--- ERROR EN ELIMINAR REPORTE ---", error);
        res.status(500).json({ message: 'Error al eliminar reporte', error: error.message });
    }
});

export default router;