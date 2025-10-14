import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './components/home.js';
import LoginPage from './components/login.js';
import RegisterPage from './components/registrarse.js';

function App() {
  return (
    <div>
      {/* <Navbar />  <-- BORRA ESTA LÍNEA */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registrarse" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;