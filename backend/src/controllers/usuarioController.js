// backend/src/controllers/usuarioController.js
import bcrypt from "bcrypt";
import { supabase } from "../config/supabase.js";

//REGISTRO
// src/controllers/usuarioController.js

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, contraseña, rol } = req.body;
    // ... (validaciones y hash de contraseña igual que antes) ...

    // 1. INSERTAR USUARIO
    const { data: usuarioData, error: usuarioError } = await supabase
      .from("usuarios")
      .insert([{ nombre, email, contraseña: hashedPassword, rol }])
      .select("id_usuario, nombre, email, rol")
      .single(); // Usamos single() para obtener el objeto directo

    if (usuarioError) throw usuarioError;

    // 2. ¡TRUCO! CREAR PERFIL DE CLIENTE AUTOMÁTICAMENTE
    // Si el rol es 'Cliente', le creamos su fila en la tabla clientes de una vez
    if (rol === 'cliente') {
        const { error: clienteError } = await supabase
            .from("clientes")
            .insert([{ 
                id_usuario: usuarioData.id_usuario, // Conectamos con el usuario recién creado
                telefono: "", // Lo dejamos vacío para que lo llene luego
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

// LOGIN
// LOGIN
export const loginUsuario = async (req, res) => {
  console.log("--- INICIO LOGIN ---"); // 1. Ver que arranca
  try {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
      return res.status(400).json({ error: "Email y contraseña son obligatorios." });
    }

    // 1. Buscar usuario
    const { data: usuario, error: usuarioError } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .single();

    if (usuarioError || !usuario) {
      console.log("Error buscando usuario:", usuarioError);
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    // 2. Verificar contraseña
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    console.log(`Usuario encontrado ID: ${usuario.id_usuario}. Buscando perfil de cliente...`);

    // --- AQUÍ ESTÁ EL CAMBIO CLAVE ---
    // 3. Buscar datos del Cliente y CAPTURAR EL ERROR
    const { data: cliente, error: clienteError } = await supabase
      .from("clientes")
      .select("id_cliente, telefono")
      .eq("id_usuario", usuario.id_usuario)
      .maybeSingle();

    // IMPRIMIR LO QUE RESPONDE SUPABASE
    if (clienteError) {
        console.error("🔴 ERROR CRÍTICO al buscar cliente:", clienteError);
        // Si sale este error en tu consola, es 100% problema de permisos/RLS
    } else {
        console.log("🟢 Respuesta de Clientes:", cliente); 
        // Si aquí sale null, es que el ID no coincide. Si sale datos, funcionó.
    }

    // 4. Respuesta
    return res.status(200).json({
      mensaje: "Login exitoso",
      usuario: {
        id_usuario: usuario.id_usuario,
        id_cliente: cliente ? cliente.id_cliente : null, 
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: cliente ? cliente.telefono : "No registrado", 
        rol: usuario.rol
      }
    });

  } catch (err) {
    console.error("Error general en login:", err.message);
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