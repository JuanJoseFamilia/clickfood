//import React, { useEffect, useState } from "react";

//function App() {
//  const [mensaje, setMensaje] = useState("");
//
//  useEffect(() => {
//    fetch("http://localhost:5000/api")
//      .then((res) => res.json())
//      .then((data) => setMensaje(data.mensaje));
//  }, []);
//
//  return (
//    <div>
//      <h1>Frontend con React ⚛️</h1>
//      <p>{mensaje}</p>
//    </div>
//  );
//}
//
//export default App;


//import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./screens/login";
import Reservas from "./screens/reservas";
import Home from "./screens/home";
import Registrarse from "./screens/registrarse";
import express from 'express'
import usuariosRouter from './routes/usuarios.js'

const app = express()
app.use(express.json())

app.use('/usuarios', usuariosRouter)

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'))


function App() {
  return (
    <div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/registrarse" element={<Registrarse />} />
      </Routes>
    </div>
  );
}

export default App;
