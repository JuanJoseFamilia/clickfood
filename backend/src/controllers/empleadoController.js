// backend/src/controllers/empleadoController.js
import Empleado from '../models/empleado.js';

// Obtener todos los empleados
export const obtenerEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.obtenerTodos();
    res.status(200).json(empleados);
  } catch (error) {
    console.error("ERROR EN OBTENER EMPLEADOS");
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los empleados', error: error.message });
  }
};

// Obtener un empleado por ID
export const obtenerEmpleadoPorId = async (req, res) => {
  try {
    const empleado = await Empleado.obtenerPorId(req.params.id);
    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    res.status(200).json(empleado);
  } catch (error) {
    console.error(`ERROR EN OBTENER EMPLEADO POR ID (${req.params.id})`);
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el empleado', error: error.message });
  }
};

// Crear un nuevo empleado
export const crearEmpleado = async (req, res) => {
  console.log("Intento de CREAR EMPLEADO. Body:", req.body);
  try {

    const { id_usuario, puesto, salario } = req.body;

    if (!id_usuario || !puesto || !salario) {
      return res.status(400).json({
        message: 'Campos requeridos: id_usuario, puesto, salario'
      });
    }

    const nuevoEmpleado = await Empleado.crear({
      id_usuario: parseInt(id_usuario),
      puesto,
      salario: parseFloat(salario)
    });
    res.status(201).json(nuevoEmpleado);

  } catch (error) {
    console.error("ERROR AL CREAR EL EMPLEADO");
    console.error("Datos:", req.body);
    console.error("Error devuelto:", error);
    res.status(500).json({ message: 'Error al crear el empleado', error: error.message });
  }
};

// Actualizar un empleado
export const actualizarEmpleado = async (req, res) => {
  console.log(`Intento de ACTUALIZAR EMPLEADO ID (${req.params.id}). Body:`, req.body);
  try {
    const { id_usuario, puesto, salario } = req.body;
    const empleadoActualizado = await Empleado.actualizar(req.params.id, {
      id_usuario: id_usuario ? parseInt(id_usuario) : undefined,
      puesto,
      salario: salario ? parseFloat(salario) : undefined,
    });

    if (!empleadoActualizado) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    res.status(200).json(empleadoActualizado);
  } catch (error) {
    console.error(`ERROR AL ACTUALIZAR EMPLEADO ID (${req.params.id})`);
    console.error("Error devuelto:", error);
    res.status(500).json({ message: 'Error al actualizar el empleado', error: error.message });
  }
};

// Eliminar un empleado
export const eliminarEmpleado = async (req, res) => {
  console.log(`Intento de ELIMINAR EMPLEADO ID (${req.params.id})`);
  try {
    const resultado = await Empleado.eliminar(req.params.id);
    if (!resultado || (Array.isArray(resultado) && resultado.length === 0)) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    console.error(`ERROR AL ELIMINAR EMPLEADO ID (${req.params.id})`);
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la mesa', error: error.message });
  }
};