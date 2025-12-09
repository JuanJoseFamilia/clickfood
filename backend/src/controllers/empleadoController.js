import Empleado from '../models/empleado.js';

export const obtenerEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.obtenerTodos();
    res.status(200).json(empleados);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los empleados', error: error.message });
  }
};

export const obtenerEmpleadoPorId = async (req, res) => {
  try {
    const empleado = await Empleado.obtenerPorId(req.params.id);
    if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });
    res.status(200).json(empleado);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el empleado', error: error.message });
  }
};

export const crearEmpleado = async (req, res) => {
 try {

  const { id_usuario, puesto, salario } = req.body;

    if (!id_usuario || !puesto || !salario) {
      return res.status(400).json({
        message: 'Faltan datos. Se requiere seleccionar un Usuario, indicar Puesto y Salario.'
      });
    }

    const nuevoEmpleado = await Empleado.crearConUsuario({
      id_usuario,
      puesto,
      salario
    });
    
    res.status(201).json(nuevoEmpleado);

  } catch (error) {
    console.error("Error en crearEmpleado:", error);
    if (error.message.includes("ya es un empleado")) {
        return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al registrar el empleado', error: error.message });
  }
};

export const actualizarEmpleado = async (req, res) => {
  try {
    const { puesto, salario } = req.body;
    const empleadoActualizado = await Empleado.actualizar(req.params.id, { puesto, salario });

    if (!empleadoActualizado) return res.status(404).json({ message: 'Empleado no encontrado' });
    res.status(200).json(empleadoActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar', error: error.message });
  }
};

export const eliminarEmpleado = async (req, res) => {
  try {
    const resultado = await Empleado.eliminar(req.params.id);
    if (!resultado) return res.status(404).json({ message: 'Empleado no encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar', error: error.message });
  }
};