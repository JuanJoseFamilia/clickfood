// src/components/dashboard.jsx
import '../styles/index.css';
import { BarChart, Bar, XAxis, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { FileText, DollarSign, Users, CreditCard, Plus, AlertTriangle, ChevronRight, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

function App() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [usuario, setUsuario] = useState(null);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const usuarioData = sessionStorage.getItem('usuario');
    if (usuarioData) {
      setUsuario(JSON.parse(usuarioData));
    } else {
      // Si no hay datos de usuario, redirigir al login
      window.location.href = '/';
    }
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    // Limpiar datos del usuario
    sessionStorage.removeItem('usuario');
    console.log('Cerrando sesión...');
    window.location.href = '/';
  };

  // Datos para las gráficas
  const dailySalesData = [
    { day: 'L', sales: 220 },
    { day: 'M', sales: 280 },
    { day: 'M', sales: 250 },
    { day: 'J', sales: 240 },
    { day: 'S', sales: 270 },
    { day: 'S', sales: 310 }
  ];

  const categoryData = [
    { name: 'Hamburguesas', value: 35, color: '#EF4444' },
    { name: 'Pizza', value: 25, color: '#F97316' },
    { name: 'Sushi', value: 20, color: '#10B981' },
    { name: 'Ensaladas', value: 20, color: '#14B8A6' }
  ];

  const demandData = [
    { time: '08:00', demand: 20 },
    { time: '10:00', demand: 35 },
    { time: '12:00', demand: 65 },
    { time: '14:00', demand: 80 },
    { time: '16:00', demand: 45 },
    { time: '18:00', demand: 70 },
    { time: '20:00', demand: 95 }
  ];

  const recentOrders = [
    { name: 'Manuel García', date: '15/02/2044', status: 'Confirmada' },
    { name: 'Valeria Ramos', date: '16/02/2044', status: 'Pendiente' },
    { name: 'Felipe Santos', date: '18/02/2044', status: 'Completada' }
  ];

  const upcomingReservations = [
    { name: 'Manuel García', table: 'Mesa 5', date: '08/02', time: '07:06' },
    { name: 'Valeria Ramos', table: 'Mesa 8', date: '08/02', time: '15:30' },
    { name: 'Felipe Santos', table: 'Mesa 3', date: '08/02', time: '19:00' }
  ];

  const topProducts = [
    { name: 'Hamburguesa', price: '$5.500' },
    { name: 'Enchiladas', price: '$1.250' },
    { name: 'Sushi', price: '$980' },
    { name: 'Pizza', price: '$650' },
    { name: 'Ensalada', price: '$250' }
  ];

  const alerts = [
    { type: 'warning', message: '2 Mesas pendientes de limpiar' },
    { type: 'warning', message: 'Papas fritas: 5 unidades restantes' },
    { type: 'danger', message: '12 Pagos pendientes de confirmación' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Barra lateral izquierda */}
      <div className="w-48 bg-gray-900 text-white p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="text-orange-500 text-2xl font-bold">ClickFood</div>
        </div>

        <nav className="space-y-2 flex-1">
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left">
            <Plus size={20} className="text-emerald-400" />
            <span className="text-sm">Agregar pedido</span>
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left">
            <Plus size={20} className="text-emerald-400" />
            <span className="text-sm">Agregar producto</span>
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left">
            <Plus size={20} className="text-emerald-400" />
            <span className="text-sm">Nueva reserva</span>
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left">
            <Plus size={20} className="text-emerald-400" />
            <span className="text-sm">Nuevo cliente</span>
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left">
            <FileText size={20} className="text-emerald-400" />
            <span className="text-sm">Reporte general</span>
          </button>
        </nav>

        {/* Botón de Logout */}
        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-600 bg-red-500 transition-colors text-left mt-4"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </button>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto">
        {/* Encabezado */}
        <header className="bg-white shadow-sm p-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            👋 Bienvenido, {usuario ? usuario.nombre : 'Cargando...'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium">320</span>
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="text-gray-600 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-gray-100"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="p-6">
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <FileText size={24} />
                <div className="text-sm opacity-90">Pedidos del día</div>
              </div>
              <div className="text-4xl font-bold">45</div>
            </div>

            <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign size={24} />
                <div className="text-sm opacity-90">Ingresos totales hoy</div>
              </div>
              <div className="text-4xl font-bold">$12,350</div>
            </div>

            <div className="bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Users size={24} />
                <div className="text-sm opacity-90">Clientes activos</div>
              </div>
              <div className="text-4xl font-bold">320</div>
            </div>

            <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard size={24} />
                <div className="text-sm opacity-90">Reservas próximas</div>
              </div>
              <div className="text-4xl font-bold">8</div>
            </div>
          </div>

          {/* Gráficas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Ventas Diarias */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Ventas diarias</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dailySalesData}>
                  <Bar dataKey="sales" fill="#10B981" radius={[8, 8, 0, 0]} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Categorías más vendidas */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Categorías más vendidas</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Predicción de demanda */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Predicción de demanda (IA)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={demandData}>
                  <defs>
                    <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="demand" stroke="#10B981" strokeWidth={3} fill="url(#demandGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sección inferior */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Alertas */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Alertas / Notificaciones</h3>
              <div className="space-y-3">
                {alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg ${alert.type === 'danger' ? 'bg-red-50' : 'bg-yellow-50'
                      }`}
                  >
                    <AlertTriangle className={alert.type === 'danger' ? 'text-red-500' : 'text-yellow-600'} size={20} />
                    <span className="text-sm text-gray-700">{alert.message}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="text-md font-semibold mb-3 text-gray-800">Historial de ingresos mensuales</h4>
                <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    <span className="text-sm font-medium">$4,380 Total de pagos completados</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Próximas Reservas */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Próximas reservas</h3>
                <button className="text-teal-500 text-sm font-medium hover:text-teal-600">Ver más</button>
              </div>
              <div className="space-y-3">
                {upcomingReservations.map((res, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <div className="font-medium text-gray-800 text-sm">{res.name}</div>
                      <div className="text-xs text-gray-500">{res.table}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-700">{res.date}</div>
                      <div className="text-xs text-gray-500">{res.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <h4 className="text-md font-semibold mb-2 text-gray-800">Total mensual</h4>
                <div className="text-3xl font-bold text-emerald-500">$43,890</div>
                <div className="text-sm text-gray-600">Pagos completados</div>
              </div>
            </div>

            {/* Actividad Reciente */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Actividad reciente</h3>

              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-3">Últimos pedidos</div>
                <div className="space-y-3">
                  {recentOrders.map((order, idx) => (
                    <div key={idx} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <span className="font-medium text-sm text-gray-800">{order.name}</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-md font-semibold mb-3 text-gray-800">Productos más vendidos</h4>
                <div className="space-y-2">
                  {topProducts.map((product, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-700">{product.name}</span>
                      <span className="font-semibold text-sm text-gray-900">{product.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="text-red-500" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Cerrar sesión</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a iniciar sesión para acceder al dashboard.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;