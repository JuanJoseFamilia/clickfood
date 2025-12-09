// backend/src/controllers/reservaController.js
import Reserva from '../models/reserva.js'; 

// Obtener todas las reservas
export const obtenerReservas = async (req, res) => {
    try {
        const reservas = await Reserva.obtenerTodas();
        res.status(200).json(reservas);
    } catch (error) {
        console.error('ERROR AL OBTENER RESERVAS:', error); 
        res.status(500).json({
            message: 'Error al obtener las reservas',
            error: error.message
        });
    }
};

// Obtener una reserva por ID
import { supabase } from "../config/supabase.js";

export const obtenerReservaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('reservas')
      .select(`
        *,
        mesas ( numero ),
        clientes (
          id_cliente,
          telefono,
          usuarios ( nombre ) 
        )
      `)
      .eq('id_reserva', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    const nombreCliente = data.clientes?.usuarios?.nombre || 'Desconocido';
    
    const respuesta = {
        ...data,
        nombre_cliente_final: nombreCliente 
    };

    res.status(200).json(respuesta);
  } catch (err) {
    console.error("Error buscando reserva:", err);
    res.status(500).json({ error: "Error al buscar la reserva" });
  }
};

export const crearReserva = async (req, res) => {
    try {
        const { id_cliente, id_mesa, fecha_hora, estado, descripcion, comentarios } = req.body;

        if (!id_cliente || !id_mesa || !fecha_hora) {
            return res.status(400).json({
                message: 'Por favor complete todos los campos requeridos (id_cliente, id_mesa, fecha_hora)'
            });
        }

        const disponible = await Reserva.verificarDisponibilidad(id_mesa, fecha_hora);
        if (!disponible) {
            return res.status(400).json({
                message: 'La mesa no está disponible en ese horario. Por favor seleccione otro horario.'
            });
        }

        const nuevaReserva = await Reserva.crear({
            id_cliente,
            id_mesa,
            fecha_hora,
            estado: estado || 'Pendiente',
            descripcion: descripcion || 'Cena Casual', 
            comentarios: comentarios || ''
        });

        res.status(201).json(nuevaReserva);
    } catch (error) {
        console.error("ERROR AL CREAR LA RESERVA:", error);
        res.status(500).json({
            message: 'Error al crear la reserva',
            error: error.message
        });
    }
};

// Actualizar una reserva
export const actualizarReserva = async (req, res) => {
    try {
        const { id_cliente, id_mesa, fecha_hora, estado } = req.body;

        const reservaActualizada = await Reserva.actualizar(req.params.id, {
            id_cliente,
            id_mesa,
            fecha_hora,
            estado
        });

        if (!reservaActualizada) {
            return res.status(404).json({
                message: 'Reserva no encontrada'
            });
        }

        res.status(200).json(reservaActualizada);
    } catch (error) {
        console.error("ERROR AL ACTUALIZAR LA RESERVA:", error);
        res.status(500).json({
            message: 'Error al actualizar la reserva',
            error: error.message
        });
    }
};

// Eliminar una reserva
export const eliminarReserva = async (req, res) => {
    try {
        const resultado = await Reserva.eliminar(req.params.id);

        if (!resultado) {
            return res.status(404).json({
                message: 'Reserva no encontrada'
            });
        }

        res.status(204).send();
    } catch (error) {
        console.error("ERROR AL ELIMINAR LA RESERVA:", error);
        res.status(500).json({
            message: 'Error al eliminar la reserva',
            error: error.message
        });
    }
};
