// src/controllers/usuariosController.js
import bcrypt from "bcrypt";
import { supabase } from "../config/supabaseClient.js";

//REGISTRO
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, contraseña, rol } = req.body;

    if (!nombre || !email || !contraseña || !rol) {
      return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    // Verificar si el usuario ya existe
    const { data: existente, error: existeError } = await supabase
      .from("usuarios")
      .select("email")
      .eq("email", email);

    if (existeError) throw existeError;

    if (existente.length > 0) {
      return res.status(400).json({ error: "El correo ya esta registrado." });
    }

    // Encriptar contraseña
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
      .select();

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