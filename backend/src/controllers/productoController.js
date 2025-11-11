// backend/src/controllers/productoController.js 
const Producto = require('../models/producto');

// Obtener todos los productos
exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.obtenerTodos();
        res.status(200).json(productos);
    } catch (error) {
        console.error("--- ERROR EN OBTENER PRODUCTOS ---");
        console.error(error);
        res.status(500).json({
            message: 'Error al obtener los productos',
            error: error.message
        });
    }
};

// Obtener un producto por ID
exports.obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Producto.obtenerPorId(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(producto);
    } catch (error) {
        console.error(`ERROR EN OBTENER PRODUCTO POR ID (${req.params.id})`);
        console.error(error);
        res.status(500).json({
            message: 'Error al obtener el producto',
            error: error.message
        });
    }
};

// Crear un nuevo producto
exports.crearProducto = async (req, res) => {
    console.log("Intento de CREAR PRODUCTO recibido. Body:", req.body);
    try {
        const { nombre, categoria, precio, stock, estado } = req.body;

        if (!nombre || !categoria || precio === undefined || stock === undefined || !estado) {
            console.warn("Validación fallida. Datos recibidos:", req.body);
            return res.status(400).json({
                message: 'Por favor complete todos los campos requeridos (nombre, categoria, precio, stock, estado)'
            });
        }

        console.log("Llamando a Producto.crear() con:", { nombre, categoria, precio, stock, estado });
        const nuevoProducto = await Producto.crear({
            nombre,
            categoria,
            precio: parseFloat(precio),
            stock: parseInt(stock),
            estado: estado
        });
        console.log("Producto creado exitosamente en BD:", nuevoProducto);

        res.status(201).json(nuevoProducto);

    } catch (error) {
        console.error("ERROR AL CREAR EL PRODUCTO");
        console.error("Datos que se intentaron guardar:", req.body);
        console.error("Error devuelto por el modelo/BD:", error);
        res.status(500).json({
            message: 'Error al crear el producto',
            error: error.message
        });
    }
};

// Actualizar un producto
exports.actualizarProducto = async (req, res) => {
    console.log(`Intento de ACTUALIZAR PRODUCTO ID (${req.params.id}). Body:`, req.body);
    try {
        const { nombre, categoria, precio, stock, estado } = req.body;

        const productoActualizado = await Producto.actualizar(req.params.id, {
            nombre,
            categoria,
            precio: precio ? parseFloat(precio) : undefined,
            stock: stock ? parseInt(stock) : undefined,
            estado: estado
        });

        if (!productoActualizado) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(productoActualizado);
    } catch (error) {
        console.error(`ERROR AL ACTUALIZAR EL PRODUCTO ID (${req.params.id}) ---`);
        console.error("Datos que se intentaron guardar:", req.body);
        console.error("Error devuelto por el modelo/BD:", error);
        res.status(500).json({
            message: 'Error al actualizar el producto',
            error: error.message
        });
    }
};

// Eliminar un producto
exports.eliminarProducto = async (req, res) => {
    console.log(`Intento de ELIMINAR PRODUCTO ID (${req.params.id})`);
    try {
        const resultado = await Producto.eliminar(req.params.id);
        if (!resultado || resultado.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        console.error(`ERROR AL ELIMINAR EL PRODUCTO ID (${req.params.id}) ---`);
        console.error(error);
        res.status(500).json({
            message: 'Error al eliminar el producto',
            error: error.message
        });
    }
};

exports.buscarPorCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;
        const productos = await Producto.buscarPorCategoria(categoria);
        res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al buscar productos por categoría',
            error: error.message
        });
    }
};
exports.obtenerStockBajo = async (req, res) => {
    try {
        const limite = req.query.limite || 10;
        const productos = await Producto.obtenerStockBajo(limite);
        res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al obtener productos con stock bajo',
            error: error.message
        });
    }
};

