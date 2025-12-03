// backend/src/models/mesa.js
import { supabase } from '../config/supabase.js';

class Mesa {


  static async obtenerTodas() {
    // Ordenamos por número para que salgan en orden en la lista
    const { data, error } = await supabase
      .from('mesas')
      .select('*')
      .order('numero', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async obtenerPorId(id) {
    const { data, error } = await supabase
      .from('mesas')
      .select('*')
      .eq('id_mesa', id)
      .single();
    
    if (error) throw error;
    return data;
  }


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
  
  // ... (Asegúrate de tener crear, actualizar, eliminar aquí abajo) ...
   static async crear(datosMesa) {
    const { data, error } = await supabase.from('mesas').insert([datosMesa]).select().single();
    if (error) throw error;
    return data;
  }
  
  static async actualizar(id, datosMesa) {
    const { data, error } = await supabase.from('mesas').update(datosMesa).eq('id_mesa', id).select().single();
    if (error) throw error;
    return data;
  }

  static async eliminar(id) {
    const { data, error } = await supabase.from('mesas').delete().eq('id_mesa', id).select();
    if (error) throw error;
    return data;
  }
}

export default Mesa;