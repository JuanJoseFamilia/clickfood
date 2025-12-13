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
                    usuarios (nombre, email) 
                ),
                mesas (
                    numero, 
                    capacidad
                )
            `)
            .neq('activo', false) 
            .order('fecha_hora', { ascending: true });

        if (error) {
            console.error('Error al obtener todas las reservas:', error);
            throw error;
        }

        return data.map(r => ({
            ...r,
            nombre_cliente: r.clientes?.usuarios?.nombre || 'Desconocido',
            email_cliente: r.clientes?.usuarios?.email || '',
            numero_mesa: r.mesas ? `Mesa ${r.mesas.numero} (Cap: ${r.mesas.capacidad})` : 'Mesa no asignada',
            capacidad_mesa: r.mesas?.capacidad || 0
        }));
    }

    static async obtenerPorId(id) {
        const { data, error } = await supabase
            .from('reservas')
            .select(`
                id_reserva, fecha_hora, id_mesa, id_cliente, estado,
                clientes (usuarios (nombre)),
                mesas (numero)
            `)
            .eq('id_reserva', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
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
                estado: reserva.estado || 'Pendiente',
                descripcion: reserva.descripcion,
                comentarios: reserva.comentarios
            }])
            .select().single();

        if (error) throw error;
        return data;
    }

    static async actualizar(id, datosReserva) {
        const updates = {};
        if (datosReserva.id_cliente) updates.id_cliente = parseInt(datosReserva.id_cliente);
        if (datosReserva.id_mesa) updates.id_mesa = parseInt(datosReserva.id_mesa);
        if (datosReserva.fecha_hora) updates.fecha_hora = datosReserva.fecha_hora;
        if (datosReserva.estado) updates.estado = datosReserva.estado;

        const { data, error } = await supabase.from('reservas').update(updates).eq('id_reserva', id).select().single();
        if (error) throw error;
        return data;
    }

    static async eliminar(id) {
const { data, error } = await supabase
        .from('reservas')
        .update({ activo: false }) 
        .eq('id_reserva', id)
        .select()
        .single();

    if (error) throw error;
            return data //&& data.length > 0;
    }

    static async verificarDisponibilidad(id_mesa, fecha_hora) {
        const fechaInicio = new Date(fecha_hora);
        const fechaFin = new Date(fechaInicio.getTime() + 2 * 60 * 60 * 1000); 

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
