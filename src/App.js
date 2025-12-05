import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './components/home.jsx';
import LoginPage from './components/login.jsx';
import RegisterPage from './components/registrarse.jsx';
import ReservaPage from './components/reservas.jsx';
import DasboardPage from './components/dasboard.jsx';
import HomeCliente from './components/HomeCliente.jsx'; // <--- NUEVO IMPORT

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/registrarse" element={<RegisterPage />} />
        
        {/* Rutas para el Cliente */}
        <Route path="/cliente/home" element={<HomeCliente />} /> {/* <--- NUEVA RUTA */}
        <Route path="/reservas" element={<ReservaPage />} />
        
        {/* Rutas para el Administrador */}
        <Route path="/dasboard" element={<DasboardPage />} />
      </Routes>
    </div>
  );
}

export default App;