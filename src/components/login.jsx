// src/components/login.jsx
import '../styles/index.css';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    
    setCargando(true);
    setMensaje('');

    const body = {
      email: email,
      contraseña: password
    };

    try {
      const res = await fetch("http://localhost:5000/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("¡Login exitoso! Redirigiendo...");
    
        console.log('Usuario:', data.usuario);
        
        // Guardar datos del usuario en sessionStorage
        sessionStorage.setItem('usuario', JSON.stringify(data.usuario));
        
        // Redirigir al dashboard
        setTimeout(() => {
          window.location.href = '/dasboard';
        }, 1000);
      } else {
        setMensaje(data.error || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error("Error:", err);
      setMensaje("Error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="flex bg-gray-800 rounded-xl shadow-2xl overflow-hidden w-full max-w-4xl">
        
        {/* Left Side - Logo */}
        <div className="w-1/2 bg-orange-500 flex items-center justify-center p-12">
          <div className="text-center">
            <div className="text-7xl font-bold text-white mb-4">Click</div>
            <div className="text-7xl font-bold text-white">Food</div>
            <div className="text-6xl ml-8 mt-4">🍴</div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/2 flex flex-col items-center justify-center px-16 py-12">
          <div className="w-full">
            {/* Welcome Message */}
            <div className="mb-12">
              <div className="text-sm text-gray-300 mb-2">👋 Bienvenido de nuevo!</div>
              <h1 className="text-4xl font-bold text-white">Inicia sesión</h1>
            </div>

            <form onSubmit={handleLogin} className="w-full">
              {/* Email Input */}
              <div className="relative mb-4">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="juan@example.com"
                  className="w-full bg-gray-700 text-white placeholder-gray-400 pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                  disabled={cargando}
                />
              </div>

              {/* Password Input */}
              <div className="relative mb-4">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="••••••••"
                  className="w-full bg-gray-700 text-white placeholder-gray-400 pl-12 pr-12 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                  disabled={cargando}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right mb-6">
                <button type="button" className="text-gray-300 text-sm hover:text-orange-500 transition">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>

              {/* Mensaje */}
              {mensaje && (
                <p className={`mt-4 text-center ${mensaje.includes('exitoso') ? 'text-green-400' : 'text-red-400'}`}>
                  {mensaje}
                </p>
              )}
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-300">
                ¿No tiene cuenta?{' '}
                <a href="/registrarse">
                  <button className="text-orange-500 hover:text-orange-400 font-semibold transition" type="button">
                    Regístrate ahora
                  </button>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}