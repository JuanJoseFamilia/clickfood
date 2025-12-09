// backend/src/models/mesa.js
import { supabase } from '../config/supabase.js';

class Mesa {


  //Obtener todas las mesas
  static async obtenerTodas() {
    const { data, error } = await supabase
      .from('mesas')
      .select('*')
      .order('numero', { ascending: true });

    if (error) throw error;
    return data;
  }

  //Obtener las mesas por el id
  static async obtenerPorId(id) {
    const { data, error } = await supabase
      .from('mesas')
      .select('*')
      .eq('id_mesa', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  //Obtener las mesas disponibles
static async obtenerDisponibles(fechaHora) {

    const { data: ocupadas } = await supabase
      .from('reservas')
      .select('id_mesa')
      .eq('fecha_hora', fechaHora)
      .neq('estado', 'Cancelada'); 


    const idsOcupados = ocupadas?.map(r => r.id_mesa) || [];

    let query = supabase
      .from('mesas')
      .select('*')
      .eq('estado', 'Disponible');

    if (idsOcupados.length > 0) {

      query = query.not('id_mesa', 'in', `(${idsOcupados.join(',')})`);
    }

    const { data, error } = await query.order('numero', { ascending: true });
    if (error) throw error;
    
    return data;
}
  
  //Crear una mesa
   static async crear(datosMesa) {
    const { data, error } = await supabase.from('mesas').insert([datosMesa]).select().single();
    if (error) throw error;
    return data;
  }
  
    //Actualizar una mesa
  static async actualizar(id, datosMesa) {
    const { data, error } = await supabase.from('mesas').update(datosMesa).eq('id_mesa', id).select().single();
    if (error) throw error;
    return data;
  }

  //Eliminar una mesa
  static async eliminar(id) {
    const { data, error } = await supabase.from('mesas').delete().eq('id_mesa', id).select();
    if (error) throw error;
    return data;
  }
}

export default Mesa;