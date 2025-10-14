import '../styles/index.css';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const handleRegister = () => {
    console.log('Register:', { username, registerEmail, registerPassword });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
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

        {/* Right Side - Register Form */}
        <div className="w-1/2 flex flex-col items-center justify-center px-16 py-12">
          <div className="w-full">
            {/* Welcome Message */}
            <div className="mb-12">
              <div className="text-sm text-gray-300 mb-2">👋 ¡Bienvenido!</div>
              <h1 className="text-4xl font-bold text-white">Crear cuenta</h1>
            </div>

            {/* Username Input */}
            <div className="relative mb-4">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tu usuario"
                className="w-full bg-gray-700 text-white placeholder-gray-400 pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Email Input */}
            <div className="relative mb-4">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="tu@correo.com"
                className="w-full bg-gray-700 text-white placeholder-gray-400 pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Password Input */}
            <div className="relative mb-6">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showRegisterPassword ? 'text' : 'password'}
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="••••••••"
                className="w-full bg-gray-700 text-white placeholder-gray-400 pl-12 pr-12 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showRegisterPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Register Button */}
            <button
              onClick={handleRegister}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-4 rounded-lg transition duration-200"
            >
              Crear cuenta
            </button>

            {/* Back to Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-300">
                ¿Ya tienes cuenta?{' '}
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="text-orange-500 hover:text-orange-400 font-semibold transition bg-none border-none cursor-pointer"
                >
                  Inicia sesión aquí
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}