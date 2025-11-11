// backend/src/models/producto.js
const { supabase } = require('../config/supabase.js');

class Producto {
  // Obtener todos los productos
  static async obtenerTodos() {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('id_producto', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Obtener producto por ID
  static async obtenerPorId(id) {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id_producto', id)
      .single();

    if (error) throw error;
    return data;
  }

  // Crear nuevo producto
  static async crear(producto) {
    const { data, error } = await supabase
      .from('productos')
      .insert([producto])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Actualizar producto
  static async actualizar(id, producto) {
    const { data, error } = await supabase
      .from('productos')
      .update(producto)
      .eq('id_producto', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Eliminar producto
  static async eliminar(id) {
    const { data, error } = await supabase
      .from('productos')
      .delete()
      .eq('id_producto', id)
      .select();

    if (error) throw error;
    return data;
  }

  // Buscar productos por categoría
  static async buscarPorCategoria(categoria) {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('categoria', categoria);

    if (error) throw error;
    return data;
  }

  // Obtener productos con stock bajo
  static async obtenerStockBajo(limite = 10) {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .lt('stock', limite)
      .order('stock', { ascending: true });

    if (error) throw error;
    return data;
  }
}

module.exports = Producto;