// backend/src/models/pedido.js
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
                clientes (usuarios(nombre)),
                empleados (puesto)
            `);

        if (error) {
            console.error('Error al obtener todos los pedidos:', error);
            throw error;
        }
        return data;
    }

    static async obtenerPorId(id) {
        const { data, error } = await supabase
            .from('pedidos')
            .select(`
                id_pedido, 
                id_cliente, 
                id_empleado,
                fecha_hora,
                total,
                estado, 
                clientes (usuarios(nombre)),
                empleados (puesto)
            `)
            .eq('id_pedido', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            console.error(`Error al obtener pedido por ID ${id}:`, error);
            throw error;
        }
        return data;
    }

    static async crear(datosPedido) {
        const { id_cliente, id_empleado, total, estado, fecha_hora } = datosPedido;

        const { data, error } = await supabase
            .from('pedidos')
            .insert([
                {
                    id_cliente: parseInt(id_cliente),
                    id_empleado: parseInt(id_empleado),
                    total: parseFloat(total),
                    estado: estado,
                    fecha_hora: fecha_hora
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error al crear pedido:', error);
            if (error.code === '23503') {
                throw new Error("Una llave foránea (cliente o empleado) no es válida.");
            }
            throw error;
        }
        return data;
    }

    static async actualizar(id, datosPedido) {
        const updates = {};
        if (datosPedido.id_cliente) updates.id_cliente = parseInt(datosPedido.id_cliente);
        if (datosPedido.id_empleado) updates.id_empleado = parseInt(datosPedido.id_empleado);
        if (datosPedido.fecha_hora) updates.fecha_hora = datosPedido.fecha_hora;
        if (datosPedido.total) updates.total = parseFloat(datosPedido.total);
        if (datosPedido.estado) updates.estado = datosPedido.estado;

        const { data, error } = await supabase
            .from('pedidos')
            .update(updates)
            .eq('id_pedido', id)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            if (error.code === '23503') throw new Error("Una llave foránea (cliente o empleado) no es válida.");
            console.error(`Error al actualizar pedido ID ${id}:`, error);
            throw error;
        }
        return data;
    }

    static async eliminar(id) {
        const { error, data } = await supabase
            .from('pedidos')
            .delete()
            .eq('id_pedido', id)
            .select();

        if (error) {
            console.error(`Error al eliminar pedido ID ${id}:`, error);
            throw error;
        }
        return data;
    }
}

export default Pedido;
