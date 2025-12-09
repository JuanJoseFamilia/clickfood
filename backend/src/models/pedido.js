import { supabase } from '../config/supabase.js';

class Pedido {
    static async obtenerTodos() {
        const { data, error } = await supabase
            .from('pedidos')
            .select(`
                id_pedido, 
                id_cliente, 
                id_empleado,
                fecha_hora, 
                total,
                estado, 
                clientes (
                    usuarios (nombre)
                ),
                empleados (
                    usuarios (nombre)
                )
            `)
            .order('fecha_hora', { ascending: false });

        if (error) {
            console.error('Error al obtener todos los pedidos:', error);
            throw error;
        }
        
        return data.map(p => ({
            ...p,
            nombre_cliente: p.clientes?.usuarios?.nombre || 'Desconocido',
            nombre_empleado: p.empleados?.usuarios?.nombre || 'Desconocido'
        }));
    }

    static async obtenerPorId(id) {
        const { data, error } = await supabase
            .from('pedidos')
            .select(`
                id_pedido, id_cliente, id_empleado, fecha_hora, total, estado, 
                clientes (usuarios(nombre)),
                empleados (usuarios(nombre))
            `)
            .eq('id_pedido', id)
            .single();
            
        if (error) throw error;
        return data;
    }

    static async obtenerDetalles(idPedido) {
        const { data, error } = await supabase
            .from('detalle_pedido')
            .select(`
                cantidad,
                subtotal,
                productos (
                    nombre,
                    precio
                )
            `)
            .eq('id_pedido', idPedido);

        if (error) {
            console.error(`Error al obtener detalles del pedido ${idPedido}:`, error);
            throw error;
        }

        return data.map(d => ({
            cantidad: d.cantidad,
            subtotal: d.subtotal,
            nombre_producto: d.productos?.nombre || 'Producto eliminado',
            precio_unitario: d.productos?.precio || 0
        }));
    }

    static async crear(datosPedido) {
        const { id_cliente, id_empleado, total, estado, fecha_hora } = datosPedido;
        const { data, error } = await supabase
            .from('pedidos')
            .insert([{ id_cliente, id_empleado, total, estado, fecha_hora }])
            .select().single();
        if (error) throw error;
        return data;
    }


    static async crearConDetalles(datosPedido) {
        const { id_cliente, id_empleado, total, estado, fecha_hora, items } = datosPedido;

        const { data: pedidoData, error: pedidoError } = await supabase
            .from('pedidos')
            .insert([{
                id_cliente: parseInt(id_cliente),
                id_empleado: parseInt(id_empleado),
                total: parseFloat(total),
                estado: estado || 'Pendiente',
                fecha_hora: fecha_hora || new Date().toISOString()
            }])
            .select()
            .single();

        if (pedidoError) throw pedidoError;

        const idPedidoGenerado = pedidoData.id_pedido;


        const detallesAInsertar = items.map(item => ({
            id_pedido: idPedidoGenerado,
            id_producto: item.id_producto,
            cantidad: parseInt(item.cantidad),
            subtotal: parseFloat(item.subtotal) 
        }));

        const { error: detallesError } = await supabase
            .from('detalle_pedido')
            .insert(detallesAInsertar);

        if (detallesError) {
            console.error("Error insertando detalles:", detallesError);
            throw detallesError;
        }

        return pedidoData;
    }

    static async actualizar(id, datosPedido) {
        const { data, error } = await supabase.from('pedidos').update(datosPedido).eq('id_pedido', id).select().single();
        if (error) throw error;
        return data;
    }

static async eliminar(id) {
        // PASO 1: Eliminar primero los detalles (productos) de ese pedido
        const { error: errorDetalles } = await supabase
            .from('detalle_pedido')
            .delete()
            .eq('id_pedido', id);

        if (errorDetalles) {
            console.error("Error al eliminar detalles:", errorDetalles);
            throw errorDetalles;
        }

        // PASO 2: Ahora que está "vacío", eliminamos el pedido principal
        const { data, error } = await supabase
            .from('pedidos')
            .delete()
            .eq('id_pedido', id)
            .select(); // Usamos select para confirmar que se borró

        if (error) throw error;
        
        return data;
    }
}

export default Pedido;