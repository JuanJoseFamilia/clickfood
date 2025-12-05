import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Utensils,
  MapPin,
  ChevronRight,
  Star,
  LogOut,
  Menu,
  X,
  Bell,
  Loader,
} from "lucide-react";

export default function HomeCliente() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [usuario, setUsuario] = useState(null);
  const [nextReservation, setNextReservation] = useState(null);
  const [favoriteProduct, setFavoriteProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // URL base de tu backend
  const API_URL = "http://localhost:5000";

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUsuario(parsedUser);
      fetchData(parsedUser.id_usuario);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const fetchData = async (idUsuario) => {
    try {
      setLoading(true);

      // 1. Obtener el ID del Cliente usando el ID de Usuario
      // (Asumiendo que tienes un endpoint /clientes que lista todo, filtramos aquí)
      // Lo ideal sería un endpoint: /clientes/usuario/:idUsuario, pero usaremos lo que tienes.
      const resClientes = await fetch(`${API_URL}/clientes`);
      const clientes = await resClientes.json();
      const clienteEncontrado = clientes.find(
        (c) => c.id_usuario === idUsuario
      );

      if (clienteEncontrado) {
        const idCliente = clienteEncontrado.id_cliente;

        // 2. Cargar Reservas del cliente
        const resReservas = await fetch(`${API_URL}/reservas`);
        if (resReservas.ok) {
          const allReservas = await resReservas.json();
          // Filtrar reservas de este cliente y futuras
          const now = new Date();
          const misReservasFuturas = allReservas
            .filter(
              (r) =>
                r.id_cliente === idCliente &&
                new Date(r.fecha_hora) >= now &&
                r.estado !== "Cancelada"
            )
            .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));

          if (misReservasFuturas.length > 0) {
            setNextReservation(misReservasFuturas[0]);
          }
        }

        // 3. Cargar Pedidos para calcular favorito
        const resPedidos = await fetch(`${API_URL}/pedidos`);
        if (resPedidos.ok) {
          const allPedidos = await resPedidos.json();
          const misPedidos = allPedidos.filter(
            (p) => p.id_cliente === idCliente
          );

          if (misPedidos.length > 0) {
            // Nota: Si tu endpoint /pedidos no devuelve el detalle, aquí solo sabríamos que pidió.
            // Para el favorito necesitaríamos el detalle. Por ahora mostramos un mensaje genérico
            // o el último pedido si tienes esa info.
            // Si quieres lógica de favoritos real, necesitaríamos un endpoint que traiga detalles.
            // Por simplicidad visual:
            setFavoriteProduct({
              name: "Tu plato favorito",
              count: misPedidos.length,
            });
          }
        }
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
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
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("es-ES", options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando tu experiencia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/cliente/home")}
            >
              <div className="text-2xl font-bold text-gray-800">
                <span className="text-orange-500">Click</span>Food
              </div>
            </div>

            {/* Menú Desktop */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate("/reservas")}
                className="text-gray-600 hover:text-orange-500 font-medium transition-colors"
              >
                Reservar
              </button>

              <div className="h-6 w-px bg-gray-300 mx-2"></div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  Hola,{" "}
                  <span className="font-bold text-gray-900">
                    {usuario?.nombre?.split(" ")[0]}
                  </span>
                </span>
                <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold border border-orange-200">
                  {usuario?.nombre?.charAt(0) || "U"}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>

            {/* Botón Menú Móvil */}
            <div className="md:hidden flex items-center gap-4">
              <Bell size={20} className="text-gray-600" />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-2 px-4 shadow-lg animate-fade-in-down">
            <div className="flex flex-col gap-4 py-2">
              <button
                onClick={() => navigate("/reservas")}
                className="text-left font-medium text-gray-700"
              >
                Reservar Mesa
              </button>
              <div className="border-t border-gray-100 pt-2 flex items-center justify-between">
                <span className="font-bold text-gray-800">
                  {usuario?.nombre}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-red-500 text-sm font-medium"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <div className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop"
            alt="Restaurante Ambiente"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="max-w-2xl">
            <div className="inline-block bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-1 mb-6 backdrop-blur-sm">
              <span className="text-orange-300 text-sm font-semibold tracking-wide uppercase">
                Nueva Experiencia
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-justify">
              <span className="text-orange-500">El sabor que amas,</span>
              <br />
              <span className="text-white">sin esperas.</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed text-justify">
              Reserva tu mesa favorita en segundos, explora nuestro menú de
              temporada y vive la experiencia gastronómica definitiva.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/reservas")}
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <Calendar size={22} />
                Reservar Mesa
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Próxima Reserva */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-orange-500 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Próxima Reserva
              </h3>
              <div className="p-2 bg-orange-50 rounded-lg">
                <Clock className="text-orange-500" size={20} />
              </div>
            </div>

            {nextReservation ? (
              <div className="space-y-2">
                <p className="text-orange-600 font-bold text-lg capitalize">
                  {formatDate(nextReservation.fecha_hora)}
                </p>
                <p className="text-gray-600 text-sm">
                  {/* Nota: Asumimos que tu backend devuelve 'numero_mesa' o un objeto 'mesas' */}
                  {nextReservation.numero_mesa || nextReservation.mesas?.numero
                    ? `Mesa ${
                        nextReservation.numero_mesa ||
                        nextReservation.mesas.numero
                      }`
                    : "Mesa asignada"}{" "}
                  •{" "}
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {nextReservation.estado}
                  </span>
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-500 text-sm italic">
                  No tienes reservas activas.
                </p>
                <button
                  onClick={() => navigate("/reservas")}
                  className="text-orange-600 font-semibold text-sm hover:text-orange-700 flex items-center gap-1 mt-3 group"
                >
                  Agendar una visita{" "}
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Favoritos */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Tu Actividad</h3>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Star className="text-blue-500" size={20} />
              </div>
            </div>
            {favoriteProduct ? (
              <div>
                <p className="text-gray-800 font-medium text-lg">
                  {favoriteProduct.name}
                </p>
                <p className="text-blue-600 text-sm font-medium mt-1">
                  Has realizado {favoriteProduct.count} pedidos
                </p>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 text-sm italic">
                  Aquí verás tus platos favoritos.
                </p>
              </div>
            )}
          </div>

          {/* Card 3: Ubicación */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-500 transform hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Nuestra Sede</h3>
              <div className="p-2 bg-green-50 rounded-lg">
                <MapPin className="text-green-500" size={20} />
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm">
                Av. Principal #123, Santo Domingo
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-green-600 text-sm font-bold">
                  Abierto ahora
                </p>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Cierra a las 11:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center border-t border-gray-800 pt-8 text-gray-500 text-sm">
          © 2025 ClickFood. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
