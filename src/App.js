
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './components/home.jsx';
import LoginPage from './components/login.jsx';
import RegisterPage from './components/registrarse.jsx';
import ReservaPage from './components/reservas.js'
import DashboardPage from './components/dasboard.jsx'

function App() {
  return (
    <div>
      {/* <Navbar />  <-- BORRA ESTA LÍNEA */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registrarse" element={<RegisterPage />} />
        <Route path="/reservas" element={<ReservaPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

      </Routes>
    </div>
  );
}

export default App;