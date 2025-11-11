// backend/src/models/cliente.js
const { supabase } = require('../config/supabase.js');

class Cliente {
  // Obtener todos los clientes
  static async obtenerTodos() {
    const { data, error } = await supabase
      .from('clientes')
      .select(`
        *,
        usuarios (
          id_usuario,
          nombre,
          email,
          rol
        )
      `)
      .order('id_cliente', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Obtener cliente por ID
  static async obtenerPorId(id) {
    const { data, error } = await supabase
      .from('clientes')
      .select(`
        *,
        usuarios (
          id_usuario,
          nombre,
          email,
          rol
        )
      `)
      .eq('id_cliente', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Crear nuevo cliente
  static async crear(cliente) {
    const { data, error } = await supabase
      .from('clientes')
      .insert([cliente])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Actualizar cliente
  static async actualizar(id, cliente) {
    const { data, error } = await supabase
      .from('clientes')
      .update(cliente)
      .eq('id_cliente', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Eliminar cliente
  static async eliminar(id) {
    const { data, error } = await supabase
      .from('clientes')
      .delete()
      .eq('id_cliente', id)
      .select();

    if (error) throw error;
    return data;
  }

  // Verificar si el usuario ya tiene un perfil de cliente
  static async verificarExistencia(id_usuario) {
    const { data, error } = await supabase
      .from('clientes')
      .select('id_cliente')
      .eq('id_usuario', id_usuario)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data !== null;
  }

  // Obtener cliente por ID de usuario
  static async obtenerPorUsuario(id_usuario) {
    const { data, error } = await supabase
      .from('clientes')
      .select(`
        *,
        usuarios (
          id_usuario,
          nombre,
          email
        )
      `)
      .eq('id_usuario', id_usuario)
      .single();

    if (error) throw error;
    return data;
  }
}

module.exports = Cliente;