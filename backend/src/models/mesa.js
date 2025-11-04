const { supabase } = require('../config/supabase.js');

class Mesa {
  // Obtener todas las mesas
  static async obtenerTodas() {
    const { data, error } = await supabase
      .from('mesas')
      .select('*')
      .order('numero', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  // Obtener mesa por ID
  static async obtenerPorId(id) {
    const { data, error } = await supabase
      .from('mesas')
      .select('*')
      .eq('id_mesa', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Obtener mesas disponibles
  static async obtenerDisponibles() {
    const { data, error } = await supabase
      .from('mesas')
      .select('*')
      .eq('estado', 'Disponible')
      .order('numero', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  // Actualizar estado de mesa
  static async actualizarEstado(id, estado) {
    const { data, error } = await supabase
      .from('mesas')
      .update({ estado })
      .eq('id_mesa', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }



  // Crear una nueva mesa
  static async crear(datosMesa) {
    const { data, error } = await supabase
      .from('mesas')
      .insert([datosMesa]) 
      .select()
      .single(); 
    
    if (error) throw error;
    return data;
  }

  // Actualizar una mesa
  static async actualizar(id, datosMesa) {
    const { data, error } = await supabase
      .from('mesas')
      .update(datosMesa) 
      .eq('id_mesa', id)
      .select()
      .single(); 
    
    if (error) throw error;
    return data;
  }

  // Eliminar una mesa
  static async eliminar(id) {
    const { data, error } = await supabase
      .from('mesas')
      .delete()
      .eq('id_mesa', id)
      .select(); 
    
    if (error) throw error;
    return data;
  }

}

module.exports = Mesa;