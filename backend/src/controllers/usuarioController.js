// src/controllers/usuariosController.js
import bcrypt from "bcrypt";
import { supabase } from "../config/supabaseClient.js";

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
