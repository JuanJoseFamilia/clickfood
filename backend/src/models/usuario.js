import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs'; 
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

class Usuario {
  // Obtener todos los usuarios
  static async obtenerTodos() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id_usuario, nombre, email, rol, activo, fecha_creacion')
      .eq('activo', true) 
      .order('id_usuario', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Obtener usuario por ID
  static async obtenerPorId(id) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id_usuario, nombre, email, rol, activo, fecha_creacion')
      .eq('id_usuario', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Crear nuevo usuario (Registro)
  static async crear(usuario) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(usuario.password, salt);

    const { data, error } = await supabase
      .from('usuarios')
      .insert([{
        ...usuario,
        password: passwordHash,
        activo: true 
      }])
      .select('id_usuario, nombre, email, rol, activo, fecha_creacion')
      .single();

    if (error) throw error;
    return data;
  }

  static async eliminar(id) {

    const { error } = await supabase
      .from('usuarios')
      .update({ activo: false }) 
      .eq('id_usuario', id);
    
    if (error) throw error;

    await supabase
        .from('clientes')
        .update({ activo: false })
        .eq('id_usuario', id);

    return true; 
  }

  static async buscarPorEmail(email) {
    console.log("--- MODELO: Buscando usuario por email:", email);

    // Buscar en tabla base Usuarios
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .eq('activo', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (usuario) {
        // SI ES CLIENTE: Buscar teléfono
        if (usuario.rol === 'cliente') {
            const { data: cliente } = await supabase
                .from('clientes')
                .select('telefono, id_cliente')
                .eq('id_usuario', usuario.id_usuario)
                .maybeSingle(); 
            
            if (cliente) {
                console.log("--- MODELO: Cliente detectado. Teléfono:", cliente.telefono);
                usuario.telefono = cliente.telefono;
                usuario.id_cliente_real = cliente.id_cliente; 
            }
        }

        // SI ES EMPLEADO: Buscar Puesto
        if (usuario.rol === 'empleado') {
            const { data: empleado } = await supabase
                .from('empleados')
                .select('puesto, id_empleado')
                .eq('id_usuario', usuario.id_usuario)
                .maybeSingle();

            if (empleado) {
                console.log("--- MODELO: Empleado detectado. Puesto:", empleado.puesto);
                usuario.puesto = empleado.puesto; 
            } else {
                console.log("--- MODELO: Es empleado pero no está en la tabla 'empleados'");
            }
        }
    }

    return usuario;
  }

  static async verificarPassword(passwordIngresado, passwordHash) {
    return await bcrypt.compare(passwordIngresado, passwordHash);
  }
}

export default Usuario;