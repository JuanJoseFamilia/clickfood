import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  LogOut,
  Menu,
  X,
  Loader,
  BookOpen,
  History,
  Ban,
  CheckCircle
} from "lucide-react";

export default function HomeCliente() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Modals
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showReservasModal, setShowReservasModal] = useState(false); 

  const [usuario, setUsuario] = useState(null);
  
  // Datos
  const [nextReservation, setNextReservation] = useState(null);
  const [myReservations, setMyReservations] = useState([]); 
  const [favoriteProduct, setFavoriteProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [menuCategorizado, setMenuCategorizado] = useState({});
  const [filterLimit, setFilterLimit] = useState(5); 

  const API_URL = "http://localhost:5000";

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUsuario(parsedUser);
      fetchData(parsedUser.id_usuario);
      fetchMenu();
    } else {
      navigate("/");
    }
  }, [navigate]);

  // --- API CALLS ---
  const fetchMenu = async () => {
    try {
      const res = await fetch(`${API_URL}/productos`);
      if (res.ok) {
        const data = await res.json();
        const lista = Array.isArray(data) ? data : (data.data || []);
        const agrupados = lista.reduce((acc, prod) => {
          const cat = prod.categoria || 'Variados';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(prod);
          return acc;
        }, {});
        setMenuCategorizado(agrupados);
      }
    } catch (error) { console.error("Error menu:", error); }
  };

  const fetchData = async (idUsuario) => {
    try {
      setLoading(true);
      const resClientes = await fetch(`${API_URL}/clientes`);
      const clientes = await resClientes.json();
      const clienteEncontrado = clientes.find((c) => c.id_usuario === idUsuario);

      if (clienteEncontrado) {
        const idCliente = clienteEncontrado.id_cliente;

        // OBTENER TODAS LAS RESERVAS
        const resReservas = await fetch(`${API_URL}/reservas`);
        if (resReservas.ok) {
          const allReservas = await resReservas.json();
          
          // Filtrar solo las de este cliente
          const misReservas = allReservas
            .filter((r) => r.id_cliente === idCliente)
            .sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));

          setMyReservations(misReservas);

          // Calcular la próxima reserva activa para el Dashboard
          const now = new Date();
          const futuras = misReservas
            .filter(r => new Date(r.fecha_hora) >= now && r.estado !== "CANCELADA" && r.estado !== "Completada")
            .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora)); 

          if (futuras.length > 0) setNextReservation(futuras[0]);
          else setNextReservation(null);
        }

        // PEDIDOS 
        const resPedidos = await fetch(`${API_URL}/pedidos`);
        if (resPedidos.ok) {
          const allPedidos = await resPedidos.json();
          const misPedidos = allPedidos.filter((p) => p.id_cliente === idCliente);
          if (misPedidos.length > 0) {
            setFavoriteProduct({ name: "Cliente Frecuente", count: misPedidos.length });
          }
        }
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };


  // --- CONFIRMAR RESERVA ---
  const handleConfirmReservation = async (idReserva) => {

    try {
      const res = await fetch(`${API_URL}/reservas/${idReserva}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Confirmada' }) 
      });

      if (res.ok) {
        alert("✅ Reserva confirmada exitosamente.");
        fetchData(usuario.id_usuario); 
      } else {
        alert("No se pudo confirmar la reserva.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión.");
    }
  };

  // --- CANCELAR RESERVA ---
  const handleCancelReservation = async (idReserva) => {
    if (!window.confirm("¿Estás seguro de que deseas cancelar esta reserva?")) return;

    try {
      const res = await fetch(`${API_URL}/reservas/${idReserva}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Cancelada' })
      });

      if (res.ok) {
        alert("Reserva cancelada correctamente.");
        // Recargar datos para actualizar la lista y la tarjeta de 'Próxima Reserva'
        fetchData(usuario.id_usuario);
      } else {
        alert("Error al cancelar la reserva.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Fecha inválida";
    return date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
  };

  // Función para asignar color al estado
  const getStatusColor = (estado) => {
      const st = estado ? estado.toUpperCase() : '';
      if (st === 'PENDIENTE') return 'bg-orange-100 text-orange-700';
      if (st === 'CONFIRMADA') return 'bg-blue-100 text-blue-700';
      if (st === 'COMPLETADA') return 'bg-green-100 text-green-700';
      if (st === 'CANCELADA') return 'bg-red-100 text-red-700';
      return 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
      
      {showReservasModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-gray-900 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <History className="text-orange-500" size={28}/>
                <div>
                  <h2 className="text-2xl font-bold">Mis Reservas</h2>
                  <p className="text-gray-400 text-sm">Historial y estado de tus visitas</p>
                </div>
              </div>
              <button onClick={() => setShowReservasModal(false)} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors">
                <X size={24} className="text-white"/>
              </button>
            </div>

            {/* Filtro y Controles */}
            <div className="p-4 bg-gray-100 border-b border-gray-200 flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Mostrar:</span>
                <select 
                    value={filterLimit} 
                    onChange={(e) => setFilterLimit(Number(e.target.value))}
                    className="bg-white border border-gray-300 rounded-md px-3 py-1 text-gray-700 focus:outline-none focus:border-orange-500"
                >
                    <option value={5}>Últimas 5</option>
                    <option value={10}>Últimas 10</option>
                    <option value={100}>Todas</option>
                </select>
            </div>

            {/* Lista de Reservas */}
            <div className="overflow-y-auto p-6 bg-gray-50 custom-scrollbar flex-1">
              {myReservations.length === 0 ? (
                <div className="text-center py-10 opacity-60">
                    <Calendar size={48} className="mx-auto mb-2 text-gray-400"/>
                    <p className="text-gray-500">No tienes historial de reservas.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myReservations.slice(0, filterLimit).map((res) => (
                    <div key={res.id_reserva} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Calendar size={16} className="text-orange-500"/>
                            <span className="font-bold text-gray-800 capitalize">
                                {formatDate(res.fecha_hora)}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-gray-500">
                                {res.mesas?.numero ? `Mesa ${res.mesas.numero}` : 'Mesa asignada al llegar'}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${getStatusColor(res.estado)}`}>
                                {res.estado}
                            </span>
                        </div>
                      </div>


                      {/* Botón CONFIRMAR (Solo si está pendiente) */}
                       {(res.estado === 'pendiente' || res.estado === 'Pendiente') && (
                           <button 
                             onClick={() => handleConfirmReservation(res.id_reserva)}
                             className="text-green-600 hover:text-green-800 hover:bg-green-50 p-2 rounded transition-colors flex flex-col items-center gap-1 text-xs font-medium"
                             title="Confirmar Asistencia"
                           >
                               <CheckCircle size={20}/>
                               Confirmar
                           </button>
                       )}

                      {/* Botón Cancelar (Solo si está pendiente o confirmada) */}
                      {(res.estado === 'pendiente' || res.estado === 'Pendiente') && (
                          <button 
                            onClick={() => handleCancelReservation(res.id_reserva)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors flex flex-col items-center gap-1 text-xs font-medium"
                            title="Cancelar Reserva"
                          >
                              <Ban size={20}/>
                              Cancelar
                          </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DEL MENÚ --- */}
      {showMenuModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-6 bg-gray-900 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <BookOpen className="text-orange-500" size={28}/>
                <div>
                  <h2 className="text-2xl font-bold">Nuestro Menú</h2>
                  <p className="text-gray-400 text-sm">Explora nuestras especialidades</p>
                </div>
              </div>
              <button onClick={() => setShowMenuModal(false)} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition-colors">
                <X size={24} className="text-white"/>
              </button>
            </div>
            <div className="overflow-y-auto p-6 bg-gray-50 custom-scrollbar">
              {Object.keys(menuCategorizado).length === 0 ? (
                <p className="text-center text-gray-500 py-10">Cargando productos...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.keys(menuCategorizado).map((categoria) => (
                    <div key={categoria} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="text-xl font-bold text-orange-600 mb-4 uppercase tracking-wider border-b border-orange-100 pb-2">{categoria}</h3>
                      <div className="space-y-4">
                        {menuCategorizado[categoria].map((prod) => (
                          <div key={prod.id_producto || prod.id} className="flex justify-between items-start group">
                            <div className="pr-4">
                              <h4 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors">{prod.nombre}</h4>
                              {prod.descripcion && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{prod.descripcion}</p>}
                            </div>
                            <span className="font-bold text-gray-900 whitespace-nowrap bg-gray-100 px-2 py-1 rounded text-sm">${prod.precio}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-100 border-t border-gray-200 text-center text-xs text-gray-500 shrink-0">* Precios sujetos a cambio.</div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/cliente/home")}>
              <div className="text-2xl font-bold text-gray-800"><span className="text-orange-500">Click</span>Food</div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => setShowMenuModal(true)} className="text-gray-600 hover:text-orange-500 font-medium transition-colors">Ver Menú</button>
              
              {/* BOTÓN MIS RESERVAS */}
              <button onClick={() => setShowReservasModal(true)} className="text-gray-600 hover:text-orange-500 font-medium transition-colors">Mis Reservas</button>
              
              <div className="h-6 w-px bg-gray-300 mx-2"></div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Hola, <span className="font-bold text-gray-900">{usuario?.nombre?.split(" ")[0]}</span></span>
                <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><LogOut size={18} /></button>
              </div>
            </div>

            <div className="md:hidden flex items-center gap-4">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-2 px-4 shadow-lg">
            <div className="flex flex-col gap-4 py-2">
              <button onClick={() => { setShowMenuModal(true); setIsMobileMenuOpen(false); }} className="text-left font-medium text-gray-700">Ver Menú</button>
              <button onClick={() => { setShowReservasModal(true); setIsMobileMenuOpen(false); }} className="text-left font-medium text-gray-700">Mis Reservas</button>
              <button onClick={handleLogout} className="text-red-500 text-sm font-medium text-left">Cerrar Sesión</button>
            </div>
          </div>
        )}
      </nav>

      <div className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop" alt="Restaurante" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight"><span className="text-orange-500">El sabor que amas,</span><br /><span className="text-white">sin esperas.</span></h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed">Reserva tu mesa favorita en segundos y explora nuestro menú de temporada.</p>
            <div className="flex gap-4">
                <button onClick={() => navigate("/reservas")} className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"><Calendar size={22} /> Reservar Mesa</button>
                <button onClick={() => setShowMenuModal(true)} className="px-8 py-4 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white font-bold rounded-full text-lg shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"><BookOpen size={22} /> Ver Menú</button>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Próxima Reserva */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-orange-500 hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Próxima Reserva</h3>
              <div className="p-2 bg-orange-50 rounded-lg"><Clock className="text-orange-500" size={20} /></div>
            </div>
            {nextReservation ? (
              <div className="space-y-2">
                <p className="text-orange-600 font-bold text-lg capitalize">{formatDate(nextReservation.fecha_hora)}</p>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">{nextReservation.estado}</span>
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">No tienes reservas activas.</p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500 hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Tu Actividad</h3>
              <div className="p-2 bg-blue-50 rounded-lg"><Star className="text-blue-500" size={20} /></div>
            </div>
            <p className="text-blue-600 text-sm font-medium">{favoriteProduct ? `Has realizado ${favoriteProduct.count} pedidos` : "Aún no tienes actividad reciente."}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-500 hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Ubicación</h3>
              <div className="p-2 bg-green-50 rounded-lg"><MapPin className="text-green-500" size={20} /></div>
            </div>
            <p className="text-gray-600 text-sm">Av. Principal #123, Santo Domingo</p>
            <p className="text-green-600 text-xs font-bold mt-1">Abierto hasta 11:00 PM</p>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8 border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">© 2025 ClickFood. Todos los derechos reservados.</div>
      </footer>
    </div>
  );
}