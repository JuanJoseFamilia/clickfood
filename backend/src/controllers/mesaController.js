import Mesa from '../models/mesa.js';

// Obtener todas las mesas
export const obtenerMesas = async (req, res) => {
  try {
    const mesas = await Mesa.obtenerTodas();
    res.status(200).json(mesas);
  } catch (error) {
    console.error("ERROR EN OBTENER MESAS");
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las mesas', error: error.message });
  }
};

// Obtener una mesa por ID
export const obtenerMesaPorId = async (req, res) => {
  try {
    const mesa = await Mesa.obtenerPorId(req.params.id);
    if (!mesa) {
      return res.status(404).json({ message: 'Mesa no encontrada' });
    }
    res.status(200).json(mesa);
  } catch (error) {
    console.error(`ERROR EN OBTENER MESA POR ID (${req.params.id}) ---`);
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la mesa', error: error.message });
  }
};

// Crear una nueva mesa
export const crearMesa = async (req, res) => {
  console.log("Intento de CREAR MESA. Body:", req.body);
  try {
    const { numero, capacidad, estado } = req.body; 

    if (numero === undefined || capacidad === undefined || !estado) { 
      return res.status(400).json({
        message: 'Campos requeridos: numero, capacidad, estado' 
      });
    }

    const nuevaMesa = await Mesa.crear({
      numero: parseInt(numero), 
      capacidad: parseInt(capacidad),
      estado
    });

    res.status(201).json(nuevaMesa);

  } catch (error) {
    console.error("ERROR AL CREAR LA MESA");
    console.error("Datos:", req.body);
    console.error("Error devuelto:", error);
    res.status(500).json({ message: 'Error al crear la mesa', error: error.message });
  }
};

// Actualizar una mesa
export const actualizarMesa = async (req, res) => {
  console.log(`Intento de ACTUALIZAR MESA ID (${req.params.id}). Body:`, req.body);
  try {
    const { numero, capacidad, estado } = req.body; 
    const mesaActualizada = await Mesa.actualizar(req.params.id, {
      numero: numero ? parseInt(numero) : undefined, 
      capacidad: capacidad ? parseInt(capacidad) : undefined,
      estado
    });

    if (!mesaActualizada) {
      return res.status(4404).json({ message: 'Mesa no encontrada' });
    }
    res.status(200).json(mesaActualizada);
  } catch (error) {
    console.error(`ERROR AL ACTUALIZAR MESA ID (${req.params.id}) ---`);
    console.error("Error devuelto:", error);
    res.status(500).json({ message: 'Error al actualizar la mesa', error: error.message });
  }
};

// Eliminar una mesa
export const eliminarMesa = async (req, res) => {
  console.log(`Intento de ELIMINAR MESA ID (${req.params.id})`);
  try {
    const resultado = await Mesa.eliminar(req.params.id);
    if (!resultado || (Array.isArray(resultado) && resultado.length === 0)) {
      return res.status(404).json({ message: 'Mesa no encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(`--- ERROR AL ELIMINAR MESA ID (${req.params.id}) ---`);
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la mesa', error: error.message });
  }
};
