// backend/src/controllers/dashboardController.js
import { supabase } from '../config/supabase.js';

export const obtenerEstadisticasDelDia = async (req, res) => {
    try {
        // Obtener la fecha de hoy sin hora
        const hoy = new Date();
        const inicioDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        const finDelDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);

        // Contar pedidos del día
        const { data: pedidosDelDia, error: errorPedidos } = await supabase
            .from('pedidos')
            .select('id_pedido')
            .gte('fecha_hora', inicioDelDia.toISOString())
            .lt('fecha_hora', finDelDia.toISOString());

        const countPedidosDelDia = pedidosDelDia?.length || 0;

        // Sumar ingresos del día
        const { data: ingresosDelDia, error: errorIngresos } = await supabase
            .from('pedidos')
            .select('total')
            .gte('fecha_hora', inicioDelDia.toISOString())
            .lt('fecha_hora', finDelDia.toISOString());

        const ingresosTotal = ingresosDelDia?.reduce((sum, p) => sum + (parseFloat(p.total) || 0), 0) || 0;

        // Contar clientes activos (que hayan hecho pedidos o reservas)
        const { data: clientesActivos, error: errorClientes } = await supabase
            .from('pedidos')
            .select('id_cliente', { count: 'exact' })
            .gte('fecha_hora', inicioDelDia.toISOString())
            .lt('fecha_hora', finDelDia.toISOString());

        const countClientesActivos = clientesActivos?.length || 0;

        // Contar reservas próximas (próximas 7 días)
        const fechaFutura = new Date();
        fechaFutura.setDate(fechaFutura.getDate() + 7);

        // Contar reservas próximas (incluye Pendiente/Confirmada, excluye Cancelada)
        const { data: reservasProximas, error: errorReservas } = await supabase
            .from('reservas')
            .select('id_reserva')
            .gte('fecha_hora', hoy.toISOString())
            .lte('fecha_hora', fechaFutura.toISOString())
            .neq('estado', 'Cancelada');

        const countReservasProximas = reservasProximas?.length || 0;

        res.status(200).json({
            pedidosDelDia: countPedidosDelDia,
            ingresosHoy: parseFloat(ingresosTotal.toFixed(2)),
            clientesActivos: countClientesActivos,
            reservasProximas: countReservasProximas
        });

    } catch (error) {
        console.error('Error en obtenerEstadisticasDelDia:', error);
        res.status(500).json({
            message: 'Error al obtener estadísticas del día',
            error: error.message
        });
    }
};

export const obtenerVentasDiarias = async (req, res) => {
    try {
        // Obtener conteo de pedidos completados por día (últimos 7 días)
        const ventasData = [];
        for (let i = 6; i >= 0; i--) {
            const fecha = new Date();
            fecha.setDate(fecha.getDate() - i);
            const inicioDelDia = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
            const finDelDia = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + 1);

            const { data: pedidos } = await supabase
                .from('pedidos')
                .select('id_pedido')
                .gte('fecha_hora', inicioDelDia.toISOString())
                .lt('fecha_hora', finDelDia.toISOString())
                .eq('estado', 'Completado');

            const countPedidos = pedidos?.length || 0;
            const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
            const dayName = dayNames[fecha.getDay()];

            ventasData.push({
                day: dayName,
                sales: countPedidos
            });
        }

        res.status(200).json(ventasData);

    } catch (error) {
        console.error('Error en obtenerVentasDiarias:', error);
        res.status(500).json({
            message: 'Error al obtener ventas diarias',
            error: error.message
        });
    }
};

export const obtenerProductosMasVendidos = async (req, res) => {
    try {
        // Obtener productos más vendidos del último mes
        const hace30Dias = new Date();
        hace30Dias.setDate(hace30Dias.getDate() - 30);

        const { data: detalles, error } = await supabase
            .from('detalle_pedido')
            .select(`
                cantidad,
                productos (nombre),
                pedidos (fecha_hora, estado)
            `)
            .gte('pedidos.fecha_hora', hace30Dias.toISOString());

        if (error) throw error;

        // Agrupar y sumar cantidades (solo pedidos completados)
        const productosMap = {};
        detalles?.forEach(d => {
            // Solo contar si el pedido está completado
            if (d.pedidos?.estado === 'Completado') {
                const nombreProducto = d.productos?.nombre || 'Desconocido';
                if (!productosMap[nombreProducto]) {
                    productosMap[nombreProducto] = 0;
                }
                productosMap[nombreProducto] += d.cantidad || 0;
            }
        });

        // Ordenar y obtener top 5
        const productosMasVendidos = Object.entries(productosMap)
            .map(([nombre, cantidad]) => ({ nombre, cantidad }))
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 5);

        res.status(200).json(productosMasVendidos);

    } catch (error) {
        console.error('Error en obtenerProductosMasVendidos:', error);
        res.status(500).json({
            message: 'Error al obtener productos más vendidos',
            error: error.message
        });
    }
};

export const obtenerCategoriasMasVendidas = async (req, res) => {
    try {
        // Obtener categorías más vendidas del último mes
        const hace30Dias = new Date();
        hace30Dias.setDate(hace30Dias.getDate() - 30);

        const { data: detalles, error } = await supabase
            .from('detalle_pedido')
            .select(`
                cantidad,
                productos (categoria),
                pedidos (fecha_hora, estado)
            `)
            .gte('pedidos.fecha_hora', hace30Dias.toISOString());

        if (error) throw error;

        // Agrupar por categoría (solo pedidos completados)
        const categoriasMap = {};
        detalles?.forEach(d => {
            // Solo contar si el pedido esta completado
            if (d.pedidos?.estado === 'Completado') {
                const categoria = d.productos?.categoria || 'Sin categoría';
                if (!categoriasMap[categoria]) {
                    categoriasMap[categoria] = 0;
                }
                categoriasMap[categoria] += d.cantidad || 0;
            }
        });

        // Convertir a formato para PieChart
        const coloresDisponibles = ['#EF4444', '#F97316', '#10B981', '#14B8A6', '#3B82F6'];
        const categoriasFormato = Object.entries(categoriasMap)
            .map(([nombre, cantidad], idx) => ({
                name: nombre,
                value: cantidad,
                color: coloresDisponibles[idx % coloresDisponibles.length]
            }))
            .sort((a, b) => b.value - a.value);

        res.status(200).json(categoriasFormato);

    } catch (error) {
        console.error('Error en obtenerCategoriasMasVendidas:', error);
        res.status(500).json({
            message: 'Error al obtener categorías más vendidas',
            error: error.message
        });
    }
};

export const obtenerProximasReservas = async (req, res) => {
    try {
        // Obtener próximas 5 reservas confirmadas
        const hoy = new Date();
        const { data: reservas, error } = await supabase
            .from('reservas')
            .select(`
                id_reserva,
                fecha_hora,
                estado,
                clientes (usuarios (nombre)),
                mesas (numero)
            `)
            .gte('fecha_hora', hoy.toISOString())
            .neq('estado', 'Cancelada')
            .order('fecha_hora', { ascending: true })
            .limit(5);

        if (error) throw error;

        const proximasReservas = reservas?.map(r => ({
            id_reserva: r.id_reserva,
            nombre_cliente: r.clientes?.usuarios?.nombre || 'Desconocido',
            numero_mesa: r.mesas?.numero || 'N/A',
            fecha_hora: r.fecha_hora,
            estado: r.estado
        })) || [];

        res.status(200).json(proximasReservas);

    } catch (error) {
        console.error('Error en obtenerProximasReservas:', error);
        res.status(500).json({
            message: 'Error al obtener próximas reservas',
            error: error.message
        });
    }
};

export const obtenerUltimosMovimientos = async (req, res) => {
    try {
        // Obtener últimos 5 pedidos completados
        const { data: pedidos, error } = await supabase
            .from('pedidos')
            .select(`
                id_pedido,
                fecha_hora,
                clientes (usuarios (nombre)),
                total
            `)
            .eq('estado', 'Completado')
            .order('fecha_hora', { ascending: false })
            .limit(5);

        if (error) throw error;

        const ultimosMovimientos = pedidos?.map(p => ({
            id_pedido: p.id_pedido,
            nombre_cliente: p.clientes?.usuarios?.nombre || 'Desconocido',
            fecha_hora: p.fecha_hora,
            total: p.total
        })) || [];

        res.status(200).json(ultimosMovimientos);

    } catch (error) {
        console.error('Error en obtenerUltimosMovimientos:', error);
        res.status(500).json({
            message: 'Error al obtener últimos movimientos',
            error: error.message
        });
    }
};
