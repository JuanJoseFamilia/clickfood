import { supabase } from '../config/supabase.js'; 

class Empleado {
    static async obtenerTodos() {
        // Obtenemos todos los empleados
        const { data, error } = await supabase
            .from('empleados')

            .select(`
                id_empleado,
                id_usuario,
                puesto,
                salario,
                usuarios (nombre, email) 
            `);

        if (error) {
            console.error('Error al obtener todos los empleados:', error);
            throw error;
        }
        return data;
    }

    static async obtenerPorId(id) {
        // Obtenemos un empleado por su ID de empleado (id_empleado)
        const { data, error } = await supabase
            .from('empleados')
            .select(`
                id_empleado,
                id_usuario,
                puesto,
                salario,
                usuarios (nombre, email) 
            `)
            .eq('id_empleado', id)
            .single(); 

        if (error) {

            if (error.code === 'PGRST116') return null;
            console.error(`Error al obtener empleado por ID ${id}:`, error);
            throw error;
        }
        return data;
    }

    static async crear(datosEmpleado) {
        // Insertar el nuevo empleado
        const { data, error } = await supabase
            .from('empleados')
            .insert([
                {
                    id_usuario: datosEmpleado.id_usuario,
                    puesto: datosEmpleado.puesto,
                    salario: datosEmpleado.salario
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error al crear empleado:', error);
            throw error;
        }
        return data;
    }

    static async actualizar(id, datosEmpleado) {
        // Actualizar un empleado por su ID de empleado
        const { data, error } = await supabase
            .from('empleados')
            .update({
                id_usuario: datosEmpleado.id_usuario,
                puesto: datosEmpleado.puesto,
                salario: datosEmpleado.salario
            })
            .eq('id_empleado', id)
            .select()
            .single();

        if (error) {

            if (error.code === 'PGRST116') return null;
            console.error(`Error al actualizar empleado por ID ${id}:`, error);
            throw error;
        }
        return data;
    }

    static async eliminar(id) {
        // Eliminar un empleado por su ID de empleado
        const { error, count } = await supabase
            .from('empleados')
            .delete()
            .eq('id_empleado', id)
            .select() 
            .single(); 
            
        if (error) {
            console.error(`Error al eliminar empleado por ID ${id}:`, error);
            throw error;
        }
        return count > 0;
    }
}

export default Empleado;
