// backend/src/controllers/reservaController.js
import Reserva from '../models/reserva.js'; // CAMBIO: Módulos ES

// Obtener todas las reservas
export const obtenerReservas = async (req, res) => {
    try {
        const reservas = await Reserva.obtenerTodas();
        // NOTA: Si esta función falla, el error va al catch, no devuelve HTML.
        res.status(200).json(reservas);
    } catch (error) {
        console.error('ERROR AL OBTENER RESERVAS:', error); // Log del error real
        res.status(500).json({
            message: 'Error al obtener las reservas',
            error: error.message
        });
    }
};

// Obtener una reserva por ID
export const obtenerReservaPorId = async (req, res) => {
    try {
        const reserva = await Reserva.obtenerPorId(req.params.id);

        if (!reserva) {
            return res.status(404).json({
                message: 'Reserva no encontrada'
            });
        }

        res.status(200).json(reserva);
    } catch (error) {
        console.error(`ERROR AL OBTENER RESERVA POR ID (${req.params.id}):`, error);
        res.status(500).json({
            message: 'Error al obtener la reserva',
            error: error.message
        });
    }
};

// Crear una nueva reserva
export const crearReserva = async (req, res) => {
    try {
        const { id_cliente, id_mesa, fecha_hora, estado } = req.body;

        if (!id_cliente || !id_mesa || !fecha_hora) {
            return res.status(400).json({
                message: 'Por favor complete todos los campos requeridos (id_cliente, id_mesa, fecha_hora)'
            });
        }

        // NOTA: Aquí deberías convertir id_cliente e id_mesa a INT antes de verificar
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
            estado: estado || 'Pendiente'
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

        // El modelo se encarga de convertir a INT si el valor existe
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
