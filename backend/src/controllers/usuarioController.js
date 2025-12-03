// backend/src/controllers/usuarioController.js
import bcrypt from "bcrypt";
import { supabase } from "../config/supabase.js";

//REGISTRO
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, contraseña, rol } = req.body;

    if (!nombre || !email || !contraseña || !rol) {
      return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    const { data: existente, error: existeError } = await supabase
      .from("usuarios")
      .select("email")
      .eq("email", email);

    if (existeError) throw existeError;

    if (existente.length > 0) {
      return res.status(400).json({ error: "El correo ya esta registrado." });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Insertar usuario
    const { data, error } = await supabase
      .from("usuarios")
      .insert([
        {
          nombre,
          email,
          contraseña: hashedPassword,
          rol,
        },
      ])
      .select("id_usuario, nombre, email, rol"); 

    if (error) throw error;

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: data[0],
    });
  } catch (err) {
    console.error("Error al registrar usuario:", err.message);
    res.status(500).json({ error: "Error al registrar usuario." });
  }
};

// LOGIN
export const loginUsuario = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
      return res.status(400).json({ error: "Email y contraseña son obligatorios." });
    }

    // Buscar usuario por email
    const { data: usuario, error: usuarioError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .single();

    if (usuarioError || !usuario) {
      if (usuarioError && usuarioError.code === 'PGRST116') {
        return res.status(401).json({ error: "Credenciales incorrectas." });
      }
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    // Verificar contraseña
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!contraseñaValida) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    // Respuesta exitosa 
    return res.status(200).json({
      mensaje: "Login exitoso",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (err) {
    console.error("Error al iniciar sesión:", err.message);
    res.status(500).json({ error: "Error al iniciar sesión." });
  }
};


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