import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, Check, ChevronLeft, ChevronRight, Utensils, AlertCircle, Gift, LogOut, Home } from 'lucide-react';

function ReservasClientePage() {
  const navigate = useNavigate(); 
  const [step, setStep] = useState(1);
  const [mesas, setMesas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reservaConfirmada, setReservaConfirmada] = useState(false);
  
  const [reservaData, setReservaData] = useState({
    fecha: '',
    hora: '',
    personas: 2,
    id_mesa: null,
    id_cliente: null,
    nombre: '',
    telefono: '',
    email: '',
    descripcion: 'Cena Casual',
    comentarios: ''
  });

  useEffect(() => {
    const cargarUsuario = () => {
      console.log("--- DEBUG: Intentando cargar usuario para reserva ---");
      
      const data = localStorage.getItem('usuario');
      if (data) {
        try {
          const usuarioEncontrado = JSON.parse(data);
          
          const idParaReserva = usuarioEncontrado.id_cliente || 
                                usuarioEncontrado.id_cliente_real || 
                                usuarioEncontrado.id_usuario;

          setReservaData(prev => ({
            ...prev,
            id_cliente: idParaReserva, 
            nombre: usuarioEncontrado.nombre || '',
            email: usuarioEncontrado.email || '',
            telefono: usuarioEncontrado.telefono || '' 
          }));
        } catch (e) {
          console.error("Error al leer usuario:", e);
        }
      }
    };
    cargarUsuario();
  }, []);

  const horasDisponibles = [];
  for (let i = 12; i <= 22; i++) {
    horasDisponibles.push(`${i.toString().padStart(2, '0')}:00`);
    if (i < 22) horasDisponibles.push(`${i.toString().padStart(2, '0')}:30`);
  }

  // Lógica del backend para buscar mesas
  const buscarMesasDisponibles = async () => {
    if (!reservaData.fecha || !reservaData.hora) {
      alert("Por favor selecciona fecha y hora primero");
      return;
    }
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        fecha: reservaData.fecha,
        hora: reservaData.hora
      });
      const response = await fetch(`http://localhost:5000/mesas/disponibles?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setMesas(data); 
        setStep(2);     
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'No se pudieron cargar las mesas'}`);
      }
    } catch (error) {
      console.error("Error buscando mesas:", error);
      alert("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!reservaData.id_cliente) {
      alert("Error Crítico: No se encontró un ID de Cliente válido.");
      setIsLoading(false);
      return;
    }
    const fechaHora = `${reservaData.fecha}T${reservaData.hora}:00`;
    
    try {
      const response = await fetch('http://localhost:5000/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_cliente: reservaData.id_cliente,
          id_mesa: reservaData.id_mesa,
          fecha_hora: fechaHora,
          descripcion: reservaData.descripcion,
          comentarios: reservaData.comentarios
        })
      });

      const result = await response.json();
      if (response.ok) {
        setReservaConfirmada(true);
        setStep(4);
      } else {
        alert(`Error: ${result.message || result.error || 'Intenta nuevamente'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión al crear la reserva.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleLogout = () => {
    if(window.confirm("¿Seguro que quieres cerrar sesión?")) {
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');   
      window.location.href = '/';    
    }
  };

  const nextStep = () => {
    if (step === 1) {
      buscarMesasDisponibles(); 
      return; 
    }
    if (step === 2 && !reservaData.id_mesa) {
      alert('Por favor selecciona una mesa');
      return;
    }
    if (step === 3) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">

      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8 shadow-lg">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/cliente/home')}>
              <Utensils size={48} />
              <div>
                <h1 className="text-4xl font-bold">ClickFood</h1>
                <p className="text-orange-100 text-lg hidden sm:block">Reserva tu mesa en minutos</p>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all border border-white/40 shadow-sm"
            >
              <LogOut size={20} />
              <span className="font-medium">Salir</span>
            </button>
          </div>
          
          {!reservaConfirmada && (
            <div className="flex items-center justify-between mt-8">
              {[
                { num: 1, label: 'Fecha y Hora' },
                { num: 2, label: 'Seleccionar Mesa' },
                { num: 3, label: 'Confirmar Datos' }
              ].map((item, idx) => (
                <React.Fragment key={item.num}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      step >= item.num ? 'bg-white text-orange-600' : 'bg-orange-400 text-white'
                    }`}>
                      {step > item.num ? <Check size={20} /> : item.num}
                    </div>
                    <span className={`hidden md:block font-medium ${
                      step >= item.num ? 'text-white' : 'text-orange-200'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div className={`flex-1 h-1 mx-2 rounded ${
                      step > item.num ? 'bg-white' : 'bg-orange-400'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">

        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">¿Cuándo quieres venir?</h2>
            <div className="space-y-6 mt-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Calendar className="inline mr-2" size={20} /> Fecha
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={reservaData.fecha}
                  onChange={(e) => setReservaData({ ...reservaData, fecha: e.target.value })}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Clock className="inline mr-2" size={20} /> Hora
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {horasDisponibles.map(hora => (
                    <button
                      key={hora}
                      onClick={() => setReservaData({ ...reservaData, hora })}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        reservaData.hora === hora
                          ? 'bg-orange-500 text-white shadow-lg'
                          : 'bg-gray-100 hover:bg-orange-100'
                      }`}
                    >
                      {hora}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Users className="inline mr-2" size={20} /> Personas
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setReservaData({ ...reservaData, personas: Math.max(1, reservaData.personas - 1) })}
                    className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold text-xl"
                  > - </button>
                  <span className="text-3xl font-bold text-gray-900 w-16 text-center">{reservaData.personas}</span>
                  <button
                    onClick={() => setReservaData({ ...reservaData, personas: Math.min(10, reservaData.personas + 1) })}
                    className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold text-xl"
                  > + </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Elige tu mesa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mesas
                .filter(m => Number(m.capacidad) >= Number(reservaData.personas))
                .map(mesa => (
                <button
                  key={mesa.id_mesa}
                  onClick={() => setReservaData({ ...reservaData, id_mesa: mesa.id_mesa })}
                  className={`p-6 rounded-xl border-2 text-left transition-all ${
                    reservaData.id_mesa === mesa.id_mesa
                      ? 'border-orange-500 bg-orange-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">Mesa {mesa.numero}</h3>
                    {reservaData.id_mesa === mesa.id_mesa && <Check className="text-orange-500" />}
                  </div>
                  <p className="text-gray-600">Capacidad: {mesa.capacidad} personas</p>
                </button>
              ))}

              {mesas.filter(m => Number(m.capacidad) >= Number(reservaData.personas)).length === 0 && (
                <p className="col-span-2 text-center text-gray-500 py-8">
                  No hay mesas disponibles para ese número de personas en este horario.
                </p>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Tus Datos</h2>
            
            {!reservaData.id_cliente && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-bold">
                      Error de cuenta: No se encontró tu ID de Cliente.
                    </p>
                    <p className="text-sm text-red-600">
                      Por favor cierra sesión y vuelve a entrar para arreglarlo.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={reservaData.nombre}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                    placeholder="Nombre del usuario"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={reservaData.telefono}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                    placeholder="Teléfono no registrado"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Correo</label>
                <input
                  type="email"
                  value={reservaData.email}
                  readOnly
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed"
                  placeholder="Correo no registrado"
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className=" text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <Gift size={18} className="text-orange-500"/>
                  Motivo de la Reserva *
                </label>
                <select
                  value={reservaData.descripcion}
                  onChange={(e) => setReservaData({ ...reservaData, descripcion: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Cena Casual">Cena Casual</option>
                  <option value="Cumpleaños">Cumpleaños</option>
                  <option value="Aniversario">Aniversario</option>
                  <option value="Reunión de Negocios">Reunión de Negocios</option>
                  <option value="Cita Romántica">Cita Romántica</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Comentarios</label>
                <textarea
                  value={reservaData.comentarios}
                  onChange={(e) => setReservaData({ ...reservaData, comentarios: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && reservaConfirmada && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-green-600" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Reserva Confirmada!</h2>
            <p className="text-gray-600 mb-8">Gracias, {reservaData.nombre}. Te esperamos.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/cliente/home')} // <--- BOTÓN VOLVER AL HOME
                className="w-full sm:w-auto px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-600 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Home size={20} />
                Volver al Inicio
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg"
              >
                Nueva Reserva
              </button>
            </div>
          </div>
        )}

        {/* NAVEGACIÓN */}
        {!reservaConfirmada && (
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold flex items-center gap-2"
              >
                <ChevronLeft size={20} /> Anterior
              </button>
            )}
            <button
              onClick={nextStep}
              disabled={isLoading}
              className="ml-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Procesando...' : step === 3 ? 'Confirmar' : 'Siguiente'}
              {!isLoading && (step === 3 ? <Check size={20} /> : <ChevronRight size={20} />)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReservasClientePage;