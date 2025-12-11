import { supabase } from '../config/supabase.js';

class Empleado {
    static async obtenerTodos() {
        const { data, error } = await supabase
            .from('empleados')
            .select(`
                id_empleado,
                id_usuario,
                puesto,
                salario,
                usuarios (nombre, email, rol)
            `)
            .eq('activo', true)
            .order('id_empleado', { ascending: false });

        if (error) {
            console.error('Error al obtener todos los empleados:', error);
            throw error;
        }
        
        return data.map(e => ({
            ...e,
            nombre_empleado: e.usuarios?.nombre || 'Desconocido',
            email_usuario: e.usuarios?.email || 'Sin email',
            rol_usuario: e.usuarios?.rol || 'N/A'
        }));
    }

    static async obtenerPorId(id) {
        const { data, error } = await supabase
            .from('empleados')
            .select(`*, usuarios (nombre, email)`)
            .eq('id_empleado', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            throw error;
        }
        return data;
    }

    static async crearConUsuario(datos) {
const { id_usuario, puesto, salario } = datos;

        // Verificar que el usuario exista
        const { data: usuarioExiste, error: errorBusqueda } = await supabase
            .from('usuarios')
            .select('id_usuario')
            .eq('id_usuario', id_usuario)
            .single();

        if (!usuarioExiste) {
            throw new Error("El usuario con ese ID no existe.");
        }

        // Insertar en la tabla empleados
        const { data: nuevoEmpleado, error } = await supabase
            .from('empleados')
            .insert([{
                id_usuario: parseInt(id_usuario),
                puesto: puesto,
                salario: parseFloat(salario)
            }])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') throw new Error("Este usuario ya es un empleado.");
            throw error;
        }


        await supabase
            .from('usuarios')
            .update({ rol: 'empleado' })
            .eq('id_usuario', id_usuario);

        return nuevoEmpleado;
    }

    static async actualizar(id, datosEmpleado) {
        const updates = {};
        if (datosEmpleado.puesto) updates.puesto = datosEmpleado.puesto;
        if (datosEmpleado.salario) updates.salario = parseFloat(datosEmpleado.salario);

        const { data, error } = await supabase
            .from('empleados')
            .update(updates)
            .eq('id_empleado', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async eliminar(id) {
        const { error } = await supabase
          .from('empleados')
          .update({ activo: false }) 
          .eq('id_empleado', id);

        if (error) throw error;
        return true;
      }
}

export default Empleado;