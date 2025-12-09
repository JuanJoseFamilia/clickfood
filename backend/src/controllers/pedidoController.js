// backend/src/controllers/pedidoController.js
import { supabase } from "../config/supabase.js"; 
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


export const obtenerPedidos = async (req, res) => {
    try {
        const { estado } = req.query;
        let query = supabase
            .from('pedidos')
            .select(`
                *,
                clientes (
                    usuarios ( nombre )
                ),
                empleados (
                    usuarios ( nombre )
                ),
                detalle_pedido (
                    cantidad,
                    productos ( nombre )
                )
            `)
            .order('fecha_hora', { ascending: false });

        if (estado) {
            query = query.eq('estado', estado);
        }

        const { data, error } = await query;

        if (error) throw error;


        const pedidosFormateados = data.map(p => ({
            ...p,
            nombre_cliente: p.clientes?.usuarios?.nombre || 'Cliente General',
            
            nombre_empleado: p.empleados?.usuarios?.nombre || 'Sin Asignar',
            
            detalles: p.detalle_pedido.map(d => ({
                cantidad: d.cantidad,
                nombre_producto: d.productos ? d.productos.nombre : 'Producto desconocido'
            }))
        }));

        res.status(200).json(pedidosFormateados);

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
    const { id_mesa, id_empleado, total, productos, notas, id_reserva, id_cliente } = req.body;

    if (!productos || productos.length === 0) {
      return res.status(400).json({ error: "No hay productos en la orden." });
    }


    const { data: mesaData, error: mesaError } = await supabase
        .from('mesas')
        .select('id_mesa')
        .eq('numero', id_mesa) 
        .single();

    if (mesaError || !mesaData) {
        return res.status(400).json({ error: `La Mesa #${id_mesa} no existe en el sistema.` });
    }

    const idMesaReal = mesaData.id_mesa; 

    let idClienteEncontrado = null;
    if (id_reserva) {
        const { data: reservaData } = await supabase
            .from('reservas')
            .select('id_cliente')
            .eq('id_reserva', id_reserva)
            .single();
        
        if (reservaData) idClienteEncontrado = reservaData.id_cliente;
    }

    // Insertar pedido
    const { data: pedidoData, error: pedidoError } = await supabase
      .from("pedidos")
      .insert([
        {
          id_empleado: id_empleado,
          id_mesa: idMesaReal, 
          id_cliente: id_cliente || idClienteEncontrado, 
          id_reserva: id_reserva ? parseInt(id_reserva) : null,
          total: total,
          estado: 'pendiente',
          fecha_hora: new Date(),
          notas: notas
        }
      ])
      .select("id_pedido")
      .single();

    if (pedidoError) throw pedidoError;

    const nuevoIdPedido = pedidoData.id_pedido;

    // Insertar detalles
    const detallesParaInsertar = productos.map((prod) => ({
      id_pedido: nuevoIdPedido,
      id_producto: prod.id_producto,   
      cantidad: prod.cantidad,
      subtotal: prod.precio * prod.cantidad
    }));

    const { error: detallesError } = await supabase
      .from("detalle_pedido")
      .insert(detallesParaInsertar);

    if (detallesError) {
      await supabase.from("pedidos").delete().eq("id_pedido", nuevoIdPedido);
      throw detallesError;
    }

    res.status(201).json({
      mensaje: "Orden creada exitosamente",
      id_pedido: nuevoIdPedido
    });

  } catch (err) {
    console.error("Error al crear pedido:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// Obtener pedidos pendientes para la cocina
export const obtenerPedidosCocina = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        detalle_pedido (
          cantidad,
          productos ( nombre )
        )
      `)
      .in('estado', ['pendiente', 'cocinando'])
      .order('fecha_hora', { ascending: true });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error("Error obteniendo comandas:", err.message);
    res.status(500).json({ error: "Error al cargar pedidos" });
  }
};

// Cambiar estado (De 'pendiente' a 'completado')
export const actualizarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params; 
    const { estado } = req.body; 

    const { error } = await supabase
      .from('pedidos')
      .update({ estado: estado })
      .eq('id_pedido', id);

    if (error) throw error;

    res.status(200).json({ mensaje: "Estado actualizado correctamente" });
  } catch (err) {
    console.error("Error actualizando pedido:", err.message);
    res.status(500).json({ error: "Error al actualizar pedido" });
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