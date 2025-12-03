import Cliente from '../models/cliente.js';

// Obtener todos los clientes
export const obtenerClientes = async (req, res) => {
    try {
        const clientes = await Cliente.obtenerTodos();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los clientes', error: error.message });
    }
};

// Obtener un cliente por ID
export const obtenerClientePorId = async (req, res) => {
    try {
        const cliente = await Cliente.obtenerPorId(req.params.id);
        if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el cliente', error: error.message });
    }
};

// Crear un nuevo cliente
export const crearCliente = async (req, res) => {
    try {
        const { id_usuario, telefono, direccion } = req.body;

        if (!id_usuario || !telefono || !direccion) {
            return res.status(400).json({ message: 'Complete todos los campos (id_usuario, telefono, direccion)' });
        }

        // Verificar si el usuario ya es cliente
        const existe = await Cliente.verificarExistencia(id_usuario);
        if (existe) {
            return res.status(400).json({ message: 'Este usuario ya tiene un perfil de cliente creado.' });
        }

        const nuevoCliente = await Cliente.crear({
            id_usuario: parseInt(id_usuario),
            telefono,
            direccion
        });

        res.status(201).json(nuevoCliente);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el cliente', error: error.message });
    }
};

// Actualizar un cliente
export const actualizarCliente = async (req, res) => {
    try {
        const { telefono, direccion } = req.body; 

        const clienteActualizado = await Cliente.actualizar(req.params.id, {
            telefono,
            direccion
        });

        if (!clienteActualizado) return res.status(404).json({ message: 'Cliente no encontrado' });
        res.status(200).json(clienteActualizado);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el cliente', error: error.message });
    }
};

// Eliminar un cliente
export const eliminarCliente = async (req, res) => {
    try {
        const resultado = await Cliente.eliminar(req.params.id);
        if (!resultado) return res.status(404).json({ message: 'Cliente no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el cliente', error: error.message });
    }
};