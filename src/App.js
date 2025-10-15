
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './components/home.jsx';
import LoginPage from './components/login.jsx';
import RegisterPage from './components/registrarse.jsx';
import ReservaPage from './components/reservas.js'
import DasboardPage from './components/dasboard.jsx'


function App() {
  return (
    <div>
      { }
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/registrarse" element={<RegisterPage />} />
        <Route path="/reservas" element={<ReservaPage />} />
        <Route path="/dasboard" element={<DasboardPage />} />

      </Routes>
    </div>
  );
}

export default App;