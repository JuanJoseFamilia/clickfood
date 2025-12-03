import express from 'express';
import { supabase } from '../config/supabase.js'; 

const router = express.Router();

// OBTENER TODAS LAS RESERVAS
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('reservas')
            .select('*')
            .order('fecha_hora', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error("Error al obtener reservas:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// CREAR NUEVA RESERVA
router.post('/', async (req, res) => {

    const { id_cliente, id_mesa, fecha_hora, descripcion, comentarios } = req.body;

    console.log("--- Intentando crear reserva ---");
    console.log("Datos:", { id_cliente, id_mesa, fecha_hora });


    if (!id_cliente || !id_mesa || !fecha_hora) {
        return res.status(400).json({ message: 'Faltan datos obligatorios (Cliente, Mesa o Fecha)' });
    }

    try {
        const { data, error } = await supabase
            .from('reservas')
            .insert([
                { 
                    id_cliente: id_cliente, 
                    id_mesa: id_mesa, 
                    fecha_hora: fecha_hora, 
                    estado: 'Pendiente',
                    descripcion: descripcion || 'Cena Casual',
                    comentarios: comentarios || ''
                }
            ])
            .select() 
            .single();

        if (error) {
            console.error('Error de Supabase:', error.message);
            throw error;
        }

        console.log("Reserva creada exitosamente ID:", data?.id_reserva);
        res.status(201).json({ message: 'Reserva creada exitosamente', reserva: data });

    } catch (error) {
        console.error('Error al insertar reserva:', error);
        res.status(500).json({ message: 'Error al crear la reserva', error: error.message });
    }
});

export default router;