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
        password: passwordHash
      }])
      .select('id_usuario, nombre, email, rol, activo, fecha_creacion')
      .single();

    if (error) throw error;
    return data;
  }


  static async buscarPorEmail(email) {
    console.log("--- DEBUG: Buscando usuario por email:", email);

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (usuario) {

        const { data: cliente } = await supabase
            .from('clientes')
            .select('telefono, id_cliente')
            .eq('id_usuario', usuario.id_usuario)
            .maybeSingle(); 
        
        if (cliente) {
            console.log("--- DEBUG: Cliente encontrado. Agregando teléfono:", cliente.telefono);
            usuario.telefono = cliente.telefono;
            usuario.id_cliente_real = cliente.id_cliente; 
        } else {
            console.log("--- DEBUG: Usuario encontrado, pero NO tiene registro en tabla 'clientes'.");
        }
    }

    return usuario;
  }

  static async verificarPassword(passwordIngresado, passwordHash) {
    return await bcrypt.compare(passwordIngresado, passwordHash);
  }
}

export default Usuario;