// backend/src/controllers/pedidoController.js
import Pedido from '../models/pedido.js';


export const obtenerDetallesPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const detalles = await Pedido.obtenerDetalles(id);
        res.status(200).json(detalles);
    } catch (error) {
        console.error('Error en obtenerDetallesPedido:', error);
        res.status(500).json({
            message: 'Error al obtener los detalles del pedido',
            error: error.message
        });
    }
};

// Obtener todos los pedidos
export const obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.obtenerTodos();
        res.status(200).json(pedidos);
    } catch (error) {
        console.error('Error en obtenerPedidos:', error);
        res.status(500).json({
            message: 'Error al obtener los pedidos',
            error: error.message
        });
    }
};

// Obtener un pedido por ID
export const obtenerPedidoPorId = async (req, res) => {
    try {
        const pedido = await Pedido.obtenerPorId(req.params.id);

        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        res.status(200).json(pedido);
    } catch (error) {
        console.error('Error en obtenerPedidoPorId:', error);
        res.status(500).json({
            message: 'Error al obtener el pedido',
            error: error.message
        });
    }
};

export const crearPedido = async (req, res) => {
    try {
        const { id_cliente, id_empleado, total, estado, fecha_hora, items } = req.body;

        if (!id_cliente || !id_empleado || !items || items.length === 0) {
            return res.status(400).json({
                message: 'Faltan datos requeridos o el pedido no tiene productos.'
            });
        }

        const nuevoPedido = await Pedido.crearConDetalles({
            id_cliente,
            id_empleado,
            total,
            estado,
            fecha_hora,
            items
        });

        res.status(201).json(nuevoPedido);
    } catch (error) {
        console.error('Error en crearPedido:', error);
        res.status(500).json({
            message: 'Error al crear el pedido',
            error: error.message
        });
    }
};

// Actualizar un pedido
export const actualizarPedido = async (req, res) => {
    try {
        const { id_cliente, id_empleado, total, estado, fecha_hora } = req.body;

        const updateData = {};
        if (id_cliente !== undefined) updateData.id_cliente = id_cliente;
        if (id_empleado !== undefined) updateData.id_empleado = id_empleado;
        if (total !== undefined) updateData.total = total;
        if (estado !== undefined) updateData.estado = estado;
        if (fecha_hora !== undefined) updateData.fecha_hora = fecha_hora;

        const pedidoActualizado = await Pedido.actualizar(req.params.id, updateData);

        if (!pedidoActualizado) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.status(200).json(pedidoActualizado);
    } catch (error) {
        console.error('Error en actualizarPedido:', error);
        res.status(500).json({
            message: 'Error al actualizar el pedido',
            error: error.message
        });
    }
};

// Eliminar un pedido
export const eliminarPedido = async (req, res) => {
    try {
        const resultado = await Pedido.eliminar(req.params.id);

        if (!resultado || resultado.length === 0) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error en eliminarPedido:', error);
        res.status(500).json({
            message: 'Error al eliminar el pedido',
            error: error.message
        });
    }
};

export const obtenerPorEstado = async (req, res) => { /* ... */ };
export const obtenerVentasDelDia = async (req, res) => { /* ... */ };
