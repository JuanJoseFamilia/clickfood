import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './components/login.jsx';
import RegisterPage from './components/registrarse.jsx';
import ReservaPage from './components/reservas.jsx';
import DasboardPage from './components/dasboard.jsx';
import HomeCliente from './components/HomeCliente.jsx';
import MeseroPage from './components/Mesero.jsx';
import CocinaPage from './components/Cocina.jsx';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/registrarse" element={<RegisterPage />} />
        
        {/* Rutas para el Cliente */}
        <Route path="/cliente/home" element={<HomeCliente />} /> 
        <Route path="/reservas" element={<ReservaPage />} />

        {/* Rutas para el Mesero y la Cocina */}
        <Route path="/cocina" element={<CocinaPage />} /> 
        <Route path="/mesero" element={<MeseroPage />} />
        
        {/* Rutas para el Administrador */}
        <Route path="/dasboard" element={<DasboardPage />} />
      </Routes>
    </div>
  );
}

export default App;