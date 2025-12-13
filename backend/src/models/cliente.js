import { supabase } from '../config/supabase.js';

class Cliente {
  static async obtenerTodos() {
    const { data, error } = await supabase
      .from('clientes')
      .select(`
        id_cliente, id_usuario, telefono, direccion,
        usuarios ( nombre, email, rol )
      `)
      .eq('activo', true) // Filtra solo los activos
      .order('id_cliente', { ascending: false });

    if (error) throw error;

    return data.map(c => ({
        ...c,
        nombre_usuario: c.usuarios?.nombre || 'Desconocido',
        email_usuario: c.usuarios?.email || 'Sin email'
    }));
  }

  static async obtenerPorId(id) {
    const { data, error } = await supabase
      .from('clientes')
      .select(`*, usuarios (id_usuario, nombre, email)`)
      .eq('id_cliente', id)
      .single();
    if (error) throw error;
    return data;
  }

  static async verificarExistencia(id_usuario) {
    const { data, error } = await supabase
      .from('clientes')
      .select('id_cliente')
      .eq('id_usuario', id_usuario)
      .maybeSingle(); 
    
    if (error) throw error;
    return data !== null;
  }

  static async crear(cliente) {
    const { data, error } = await supabase
      .from('clientes')
      .insert([{
          id_usuario: parseInt(cliente.id_usuario),
          telefono: cliente.telefono,
          direccion: cliente.direccion,
          activo: true 
      }])
      .select().single();
    if (error) throw error;
    return data;
  }

  static async actualizar(id, cliente) {
    const updates = {};
    if (cliente.telefono) updates.telefono = cliente.telefono;
    if (cliente.direccion) updates.direccion = cliente.direccion;

    const { data, error } = await supabase
      .from('clientes')
      .update(updates)
      .eq('id_cliente', id)
      .select().single();
    if (error) throw error;
    return data;
  }

  static async eliminar(id) {
    const { data: clienteActual } = await supabase
        .from('clientes')
        .select('id_usuario')
        .eq('id_cliente', id)
        .single();

    const { error: errorCliente } = await supabase
      .from('clientes')
      .update({ activo: false }) 
      .eq('id_cliente', id);
    
    if (errorCliente) throw errorCliente;

    if (clienteActual && clienteActual.id_usuario) {
        await supabase
            .from('usuarios')
            .update({ activo: false })
            .eq('id_usuario', clienteActual.id_usuario);
    }

    return true; 
  }
}

export default Cliente;