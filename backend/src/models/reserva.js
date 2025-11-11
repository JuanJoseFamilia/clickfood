// backend/src/models/reserva.js
import { supabase } from '../config/supabase.js';

class Reserva {
    static async obtenerTodas() {
        const { data, error } = await supabase
            .from('reservas')
            .select(`
                id_reserva, 
                fecha_hora, 
                id_mesa,
                id_cliente,
                estado,
                clientes (
                    id_cliente, 
                    telefono, 
                    usuarios (nombre, email) 
                ),
                mesas (
                    numero, 
                    capacidad
                )
            `)
            .order('fecha_hora', { ascending: true });

        if (error) {
            console.error('Error al obtener todas las reservas:', error);
            throw error;
        }
        return data;
    }

    static async obtenerPorId(id) {
        const { data, error } = await supabase
            .from('reservas')
            .select(`
                id_reserva,
                fecha_hora,
                id_mesa,
                id_cliente,
                estado,
                clientes (
                    telefono,
                    usuarios (nombre, email)
                ),
                mesas (
                    numero,
                    capacidad
                )
            `)
            .eq('id_reserva', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            console.error('Error al obtener reserva por ID:', error);
            throw error;
        }
        return data;
    }

    static async crear(reserva) {
        const { data, error } = await supabase
            .from('reservas')
            .insert([{
                id_cliente: parseInt(reserva.id_cliente),
                id_mesa: parseInt(reserva.id_mesa),
                fecha_hora: reserva.fecha_hora,
                estado: reserva.estado || 'Pendiente'
            }])
            .select()
            .single();

        if (error) {
            console.error('Error al crear reserva:', error);
            throw error;
        }
        return data;
    }

    static async actualizar(id, datosReserva) {
        const updates = {};

        if (datosReserva.id_cliente !== undefined) updates.id_cliente = parseInt(datosReserva.id_cliente);
        if (datosReserva.id_mesa !== undefined) updates.id_mesa = parseInt(datosReserva.id_mesa);
        if (datosReserva.fecha_hora !== undefined) {
            updates.fecha_hora = datosReserva.fecha_hora === '' ? null : datosReserva.fecha_hora;
        }
        if (datosReserva.estado !== undefined) updates.estado = datosReserva.estado;

        const { data, error } = await supabase
            .from('reservas')
            .update(updates)
            .eq('id_reserva', id)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            console.error('Error al actualizar reserva:', error);
            throw error;
        }
        return data;
    }

    static async eliminar(id) {
        const { error, count } = await supabase
            .from('reservas')
            .delete()
            .eq('id_reserva', id);

        if (error) {
            console.error('Error al eliminar reserva:', error);
            throw error;
        }
        return count > 0;
    }

    static async verificarDisponibilidad(id_mesa, fecha_hora) {
        const fechaInicio = new Date(fecha_hora);
        const fechaFin = new Date(fechaInicio.getTime() + 2 * 60 * 60 * 1000); // 2 horas después

        const { data, error } = await supabase
            .from('reservas')
            .select('*')
            .eq('id_mesa', id_mesa)
            .gte('fecha_hora', fechaInicio.toISOString())
            .lte('fecha_hora', fechaFin.toISOString())
            .in('estado', ['Pendiente', 'Confirmada']);

        if (error) throw error;
        return data.length === 0;
    }

    static async obtenerReservasDelDia() {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const manana = new Date(hoy);
        manana.setDate(manana.getDate() + 1);

        const { data, error } = await supabase
            .from('reservas')
            .select(`
                *,
                clientes (
                    telefono,
                    usuarios (nombre, email)
                ),
                mesas (numero, capacidad)
            `)
            .gte('fecha_hora', hoy.toISOString())
            .lt('fecha_hora', manana.toISOString())
            .order('fecha_hora', { ascending: true });

        if (error) throw error;
        return data;
    }
}

export default Reserva;
