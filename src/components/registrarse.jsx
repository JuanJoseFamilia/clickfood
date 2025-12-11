import { API_URL } from '../config';
import '../styles/index.css';
import { useState } from 'react';
import { Eye, EyeOff, Phone, MapPin } from 'lucide-react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault(); 

    const body = {
      nombre: username,
      email: registerEmail,
      contraseña: registerPassword,
      telefono: telefono,   
      direccion: direccion, 
      rol: "cliente"
    };

    try {
      const res = await fetch(`${ API_URL }/usuarios/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("Registro exitoso, ya puedes iniciar sesión.");
        setUsername('');
        setRegisterEmail('');
        setRegisterPassword('');
        setTelefono('');
        setDireccion('');
      } else {
        setMensaje(`${data.error}`);
      }
    } catch (err) {
      console.error("Error:", err);
      setMensaje("Error al conectar con el servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="flex bg-gray-800 rounded-xl shadow-2xl overflow-hidden w-full max-w-4xl">

        <div className="w-1/2 bg-orange-500 flex items-center justify-center p-12 hidden md:flex">
          <div className="text-center">
            <div className="text-7xl font-bold text-white mb-4">Click</div>
            <div className="text-7xl font-bold text-white">Food</div>
            <div className="text-6xl ml-8 mt-4">🍴</div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-8 sm:px-16 py-12">
          <div className="w-full">
 
            <div className="mb-8">
              <div className="text-sm text-gray-300 mb-2">¡Bienvenido!</div>
              <h1 className="text-3xl font-bold text-white">Crear cuenta</h1>
            </div>

            <form onSubmit={handleRegister} className="w-full">

              {/* CAMPO USUARIO */}
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
                  placeholder="Nombre completo"
                  className="w-full bg-gray-700 text-white placeholder-gray-400 pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              {/* CAMPO EMAIL */}
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
                  placeholder="tu@correo.com"
                  className="w-full bg-gray-700 text-white placeholder-gray-400 pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              
              {/* CAMPO TELEFONO */}
              <div className="relative mb-4">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Phone size={20} />
                </div>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Teléfono"
                  className="w-full bg-gray-700 text-white placeholder-gray-400 pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              {/* CAMPO DIRECCION */}
              <div className="relative mb-4">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <MapPin size={20} />
                </div>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Dirección"
                  className="w-full bg-gray-700 text-white placeholder-gray-400 pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              {/* CAMPO PASSWORD */}
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
                  placeholder="Contraseña"
                  className="w-full bg-gray-700 text-white placeholder-gray-400 pl-12 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showRegisterPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-4 rounded-lg transition duration-200"
              >
                Crear cuenta
              </button>

              {mensaje && (
                <p className={`mt-4 text-center ${mensaje.includes('exitoso') ? 'text-green-400' : 'text-red-400'}`}>
                  {mensaje}
                </p>
              )}
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-300">
                ¿Ya tienes cuenta?{' '}
                <button 
                  onClick={() => window.location.href = '/'}
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