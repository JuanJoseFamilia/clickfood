const { supabase } = require('../config/supabase.js');
const bcrypt = require('bcryptjs');

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

  // Crear nuevo usuario
  static async crear(usuario) {
    // Encriptar contraseña
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

  // Buscar usuario por email (para login)
  static async buscarPorEmail(email) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Verificar contraseña
  static async verificarPassword(passwordIngresado, passwordHash) {
    return await bcrypt.compare(passwordIngresado, passwordHash);
  }
}

module.exports = Usuario;