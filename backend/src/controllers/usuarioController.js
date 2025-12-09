// backend/src/controllers/usuarioController.js
import bcrypt from "bcrypt";
import { supabase } from "../config/supabase.js";

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, contraseña, rol } = req.body;
    
    if (!email || !contraseña || !nombre) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);


    //Insertar usuario
    const { data: usuarioData, error: usuarioError } = await supabase
      .from("usuarios")
      .insert([{ nombre, email, contraseña: hashedPassword, rol }])
      .select("id_usuario, nombre, email, rol")
      .single(); 

    if (usuarioError) throw usuarioError;

    if (rol === 'cliente') {
        const { error: clienteError } = await supabase
            .from("clientes")
            .insert([{ 
                id_usuario: usuarioData.id_usuario, 
                telefono: "", 
                direccion: "" 
            }]);
        
        if (clienteError) console.error("Error creando perfil cliente:", clienteError);
    }

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: usuarioData,
    });

  } catch (err) {
    console.error("Error al registrar usuario:", err.message);
    res.status(500).json({ error: "Error al registrar usuario." });
  }
};

// Login
export const loginUsuario = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    // Validar entrada
    if (!email || !contraseña) {
      return res.status(400).json({ error: "Email y contraseña son obligatorios." });
    }

    // Buscar usuario en tabla 'usuarios'
    const { data: usuario, error: usuarioError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .single();

    if (usuarioError || !usuario) {
      return res.status(401).json({ error: "Usuario no encontrado." });
    }

    // Verificar contraseña
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ error: "Contraseña incorrecta." });
    }

    console.log(`Usuario autenticado: ${usuario.nombre} (${usuario.rol})`);

    // Obtener datos extra según el ROL
    let puestoEncontrado = null; // Para empleados
    let datosCliente = {};       // Para clientes

    if (usuario.rol === 'empleado') {
        // Buscar en la tabla empleados
        const { data: empleado, error: errEmp } = await supabase
            .from("empleados")
            .select("puesto")
            .eq("id_usuario", usuario.id_usuario)
            .maybeSingle(); 

        if (empleado) {
            puestoEncontrado = empleado.puesto; 
            console.log("Es empleado. Puesto detectado:", puestoEncontrado);
        } else {
            console.log("Es empleado en 'usuarios' pero NO está en la tabla 'empleados'.");
        }
    } 
    else if (usuario.rol === 'cliente') {
        // Buscar en la tabla clientes
        const { data: cliente } = await supabase
            .from("clientes")
            .select("id_cliente, telefono")
            .eq("id_usuario", usuario.id_usuario)
            .maybeSingle();
        
        if (cliente) datosCliente = cliente;
    }

    res.status(200).json({
      mensaje: "Login exitoso",
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        puesto: puestoEncontrado, 
        telefono: datosCliente.telefono || null
      }
    });

  } catch (err) {
    console.error("Error en login:", err.message);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};


//Obtener todos los usuario
export const getAllUsuarios = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id_usuario, nombre, email, rol");

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error("Error al obtener usuarios:", err.message);
    res.status(500).json({ error: "Error al obtener usuarios." });
  }
};


//Obtener todos los usuario por id
export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("usuarios")
      .select("id_usuario, nombre, email, rol")
      .eq("id_usuario", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: "Usuario no encontrado." });
      }
      throw error;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Error al obtener usuario:", err.message);
    res.status(500).json({ error: "Error al obtener usuario." });
  }
};


//Actualizar usuario
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, rol, contraseña } = req.body;

    const updates = {};

    if (nombre) updates.nombre = nombre;
    if (email) updates.email = email;
    if (rol) updates.rol = rol;

    if (contraseña) {
      updates.contraseña = await bcrypt.hash(contraseña, 10);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No se proporcionaron datos para actualizar." });
    }

    const { data, error } = await supabase
      .from("usuarios")
      .update(updates)
      .eq("id_usuario", id)
      .select("id_usuario, nombre, email, rol");

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    res.status(200).json({
      mensaje: "Usuario actualizado correctamente",
      usuario: data[0],
    });

  } catch (err) {
    console.error("Error al actualizar usuario:", err.message);
    res.status(500).json({ error: "Error al actualizar usuario." });
  }
};


//Eliminar usuario
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("usuarios")
      .delete()
      .eq("id_usuario", id)
      .select("id_usuario, nombre"); 
    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    res.status(200).json({
      mensaje: "Usuario eliminado correctamente",
      usuario_eliminado: data[0]
    });
  } catch (err) {
    console.error("Error al eliminar usuario:", err.message);
    res.status(500).json({ error: "Error al eliminar usuario." });
  }
};