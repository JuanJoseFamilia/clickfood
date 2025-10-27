import { BarChart, Bar, XAxis, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { FileText, DollarSign, Users, CreditCard, Plus, AlertTriangle, ChevronRight, LogOut, Search, Edit2, Trash2, X, Save, Package, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';

const categorias = ['Hamburguesas', 'Pizzas', 'Ensaladas', 'Pastas', 'Bebidas', 'Postres', 'Entradas'];
const tiposDeReporte = ['Ventas', 'Inventario', 'Clientes', 'Reservas', 'Pedidos', 'General'];

function App() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showProductCRUD, setShowProductCRUD] = useState(false);
  const [usuario, setUsuario] = useState({ nombre: 'juan jose' });

  // Estados del CRUD de productos
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'Hamburguesas',
    precio: '',
    stock: '',
    estado: 'Activo'
  });

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal para crear
  const handleCreate = () => {
    setCurrentProduct(null);
    setFormData({
      nombre: '',
      categoria: 'Hamburguesas',
      precio: '',
      stock: '',
      estado: 'Activo'
    });
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setFormData({
      nombre: product.nombre,
      categoria: product.categoria,
      precio: product.precio,
      stock: product.stock,
      estado: product.estado
    });
    setShowModal(true);
  };

  // Guardar producto (crear o actualizar)
  const handleSave = () => {
    if (!formData.nombre || !formData.precio || !formData.stock) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    if (currentProduct) {
      // Actualizar
      setProducts(products.map(p =>
        p.id === currentProduct.id
          ? { ...currentProduct, ...formData, precio: parseFloat(formData.precio), stock: parseInt(formData.stock) }
          : p
      ));
    } else {
      // Crear
      const newProduct = {
        id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock)
      };
      setProducts([...products, newProduct]);
    }

    setShowModal(false);
  };

  // Confirmar eliminación
  const handleDelete = (product) => {
    setCurrentProduct(product);
    setShowDeleteModal(true);
  };

  // Eliminar producto
  const confirmDelete = () => {
    setProducts(products.filter(p => p.id !== currentProduct.id));
    setShowDeleteModal(false);
  };



  // ============= ESTADOS DEL CRUD DE PEDIDOS =============
  const [showOrderCRUD, setShowOrderCRUD] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showOrderDeleteModal, setShowOrderDeleteModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderFormData, setOrderFormData] = useState({
    id_cliente: '',
    id_empleado: '',
    total: '',
    estado: 'Pendiente'
  });

  // ============= FILTRAR PEDIDOS =============
  const filteredOrders = orders.filter(order =>
    order.id_pedido.toString().includes(orderSearchTerm) ||
    order.id_cliente.toString().includes(orderSearchTerm) ||
    order.estado.toLowerCase().includes(orderSearchTerm.toLowerCase())
  );

  // ============= FUNCIONES CRUD PARA PEDIDOS =============
  const handleCreateOrder = () => {
    setCurrentOrder(null);
    setOrderFormData({
      id_cliente: '',
      id_empleado: '',
      total: '',
      estado: 'Pendiente'
    });
    setShowOrderModal(true);
  };

  const handleEditOrder = (order) => {
    setCurrentOrder(order);
    setOrderFormData({
      id_cliente: order.id_cliente,
      id_empleado: order.id_empleado,
      total: order.total,
      estado: order.estado
    });
    setShowOrderModal(true);
  };

  const handleSaveOrder = () => {
    if (!orderFormData.id_cliente || !orderFormData.id_empleado || !orderFormData.total) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    if (currentOrder) {
      // Actualizar
      setOrders(orders.map(o =>
        o.id_pedido === currentOrder.id_pedido
          ? {
            ...currentOrder,
            ...orderFormData,
            id_cliente: parseInt(orderFormData.id_cliente),
            id_empleado: parseInt(orderFormData.id_empleado),
            total: parseFloat(orderFormData.total)
          }
          : o
      ));
    } else {
      // Crear
      const newOrder = {
        id_pedido: orders.length > 0 ? Math.max(...orders.map(o => o.id_pedido)) + 1 : 1,
        ...orderFormData,
        id_cliente: parseInt(orderFormData.id_cliente),
        id_empleado: parseInt(orderFormData.id_empleado),
        total: parseFloat(orderFormData.total),
        fecha_hora: new Date().toISOString()
      };
      setOrders([...orders, newOrder]);
    }

    setShowOrderModal(false);
  };

  const handleDeleteOrder = (order) => {
    setCurrentOrder(order);
    setShowOrderDeleteModal(true);
  };

  const confirmDeleteOrder = () => {
    setOrders(orders.filter(o => o.id_pedido !== currentOrder.id_pedido));
    setShowOrderDeleteModal(false);
  };
  // ============= FIN CRUD PEDIDOS =============


  // ============= ESTADOS DEL CRUD DE RESERVAS =============
  const [showReservaCRUD, setShowReservaCRUD] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [reservaSearchTerm, setReservaSearchTerm] = useState('');
  const [showReservaModal, setShowReservaModal] = useState(false);
  const [showReservaDeleteModal, setShowReservaDeleteModal] = useState(false);
  const [currentReserva, setCurrentReserva] = useState(null);
  const [reservaFormData, setReservaFormData] = useState({
    id_cliente: '',
    id_mesa: '',
    fecha_hora: '',
    estado: 'Pendiente'
  });

  // ============= FILTRAR RESERVAS =============
  const filteredReservas = reservas.filter(reserva =>
    reserva.id_reserva.toString().includes(reservaSearchTerm) ||
    reserva.id_cliente.toString().includes(reservaSearchTerm) ||
    reserva.id_mesa.toString().includes(reservaSearchTerm) ||
    reserva.estado.toLowerCase().includes(reservaSearchTerm.toLowerCase())
  );

  // ============= FUNCIONES CRUD PARA RESERVAS =============
  const handleCreateReserva = () => {
    setCurrentReserva(null);
    setReservaFormData({
      id_cliente: '',
      id_mesa: '',
      fecha_hora: '',
      estado: 'Pendiente'
    });
    setShowReservaModal(true);
  };

  const handleEditReserva = (reserva) => {
    setCurrentReserva(reserva);
    setReservaFormData({
      id_cliente: reserva.id_cliente,
      id_mesa: reserva.id_mesa,
      // Formatea la fecha ISO a 'YYYY-MM-DDTHH:MM' para el input datetime-local
      fecha_hora: new Date(reserva.fecha_hora).toISOString().slice(0, 16),
      estado: reserva.estado
    });
    setShowReservaModal(true);
  };

  const handleSaveReserva = () => {
    if (!reservaFormData.id_cliente || !reservaFormData.id_mesa || !reservaFormData.fecha_hora) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    if (currentReserva) {
      // Actualizar
      setReservas(reservas.map(r =>
        r.id_reserva === currentReserva.id_reserva
          ? {
            ...currentReserva,
            ...reservaFormData,
            id_cliente: parseInt(reservaFormData.id_cliente),
            id_mesa: parseInt(reservaFormData.id_mesa)
            // fecha_hora ya es un string del formulario
          }
          : r
      ));
    } else {
      // Crear
      const newReserva = {
        id_reserva: reservas.length > 0 ? Math.max(...reservas.map(r => r.id_reserva)) + 1 : 1,
        ...reservaFormData,
        id_cliente: parseInt(reservaFormData.id_cliente),
        id_mesa: parseInt(reservaFormData.id_mesa),
        fecha_hora: new Date(reservaFormData.fecha_hora).toISOString() // Guardar como ISO
      };
      setReservas([...reservas, newReserva]);
    }

    setShowReservaModal(false);
  };

  const handleDeleteReserva = (reserva) => {
    setCurrentReserva(reserva);
    setShowReservaDeleteModal(true);
  };

  const confirmDeleteReserva = () => {
    setReservas(reservas.filter(r => r.id_reserva !== currentReserva.id_reserva));
    setShowReservaDeleteModal(false);
  };
  // ============= FIN CRUD RESERVAS =============

  // ============= ESTADOS DEL CRUD DE CLIENTES =============
  const [showClienteCRUD, setShowClienteCRUD] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [clienteSearchTerm, setClienteSearchTerm] = useState('');
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showClienteDeleteModal, setShowClienteDeleteModal] = useState(false);
  const [currentCliente, setCurrentCliente] = useState(null);
  const [clienteFormData, setClienteFormData] = useState({
    id_usuario: '',
    telefono: '',
    direccion: ''
  });

  // ============= FILTRAR CLIENTES =============
  const filteredClientes = clientes.filter(cliente =>
    cliente.telefono.toLowerCase().includes(clienteSearchTerm.toLowerCase()) ||
    cliente.direccion.toLowerCase().includes(clienteSearchTerm.toLowerCase()) ||
    cliente.id_usuario.toString().includes(clienteSearchTerm)
  );

  // ============= FUNCIONES CRUD PARA CLIENTES =============
  const handleCreateCliente = () => {
    setCurrentCliente(null);
    setClienteFormData({
      id_usuario: '',
      telefono: '',
      direccion: ''
    });
    setShowClienteModal(true);
  };

  const handleEditCliente = (cliente) => {
    setCurrentCliente(cliente);
    setClienteFormData({
      id_usuario: cliente.id_usuario,
      telefono: cliente.telefono,
      direccion: cliente.direccion
    });
    setShowClienteModal(true);
  };

  const handleSaveCliente = () => {
    if (!clienteFormData.id_usuario || !clienteFormData.telefono || !clienteFormData.direccion) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    if (currentCliente) {
      // Actualizar
      setClientes(clientes.map(c =>
        c.id_cliente === currentCliente.id_cliente
          ? {
            ...currentCliente,
            ...clienteFormData,
            id_usuario: parseInt(clienteFormData.id_usuario)
          }
          : c
      ));
    } else {
      // Crear
      const newCliente = {
        id_cliente: clientes.length > 0 ? Math.max(...clientes.map(c => c.id_cliente)) + 1 : 1,
        ...clienteFormData,
        id_usuario: parseInt(clienteFormData.id_usuario)
      };
      setClientes([...clientes, newCliente]);
    }
    setShowClienteModal(false);
  };

  const handleDeleteCliente = (cliente) => {
    setCurrentCliente(cliente);
    setShowClienteDeleteModal(true);
  };

  const confirmDeleteCliente = () => {
    setClientes(clientes.filter(c => c.id_cliente !== currentCliente.id_cliente));
    setShowClienteDeleteModal(false);
  };
  // ============= FIN CRUD CLIENTES =============

  // ============= ESTADOS DEL CRUD DE REPORTES =============
  const [showReporteCRUD, setShowReporteCRUD] = useState(false);
  const [reportes, setReportes] = useState([]);
  const [reporteSearchTerm, setReporteSearchTerm] = useState('');
  const [showReporteModal, setShowReporteModal] = useState(false);
  const [showReporteDeleteModal, setShowReporteDeleteModal] = useState(false);
  const [currentReporte, setCurrentReporte] = useState(null);
  const [reporteFormData, setReporteFormData] = useState({
    tipo: 'Ventas',
    fecha: '',
    datos: '{}'
  });

  // ============= FILTRAR REPORTES =============
  const filteredReportes = reportes.filter(reporte =>
    reporte.tipo.toLowerCase().includes(reporteSearchTerm.toLowerCase())
  );
  // ============= FUNCIONES CRUD PARA REPORTES =============
  const handleCreateReporte = () => {
    setCurrentReporte(null);
    setReporteFormData({
      tipo: 'Ventas',
      fecha: new Date().toISOString().slice(0, 16), // Poner fecha y hora actual
      datos: '{\n  "ejemplo_clave": "ejemplo_valor"\n}' // JSON de ejemplo
    });
    setShowReporteModal(true);
  };

  const handleEditReporte = (reporte) => {
    setCurrentReporte(reporte);
    setReporteFormData({
      tipo: reporte.tipo,
      fecha: new Date(reporte.fecha).toISOString().slice(0, 16),
      // Formatear el JSON para que se vea bien en el textarea
      datos: JSON.stringify(reporte.datos, null, 2)
    });
    setShowReporteModal(true);
  };

  const handleSaveReporte = () => {
    if (!reporteFormData.tipo || !reporteFormData.fecha || !reporteFormData.datos) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    let datosJSON;
    try {
      // Validamos que el texto en el campo 'datos' sea un JSON válido
      datosJSON = JSON.parse(reporteFormData.datos);
    } catch (error) {
      alert('El campo "Datos" no contiene un JSON válido. Por favor, corrija el formato.\nEjemplo: { "clave": "valor" }');
      return;
    }

    if (currentReporte) {
      // Actualizar
      setReportes(reportes.map(r =>
        r.id_reporte === currentReporte.id_reporte
          ? {
            ...currentReporte,
            tipo: reporteFormData.tipo,
            fecha: new Date(reporteFormData.fecha).toISOString(),
            datos: datosJSON // Guardamos el objeto JSON parseado
          }
          : r
      ));
    } else {
      // Crear
      const newReporte = {
        id_reporte: reportes.length > 0 ? Math.max(...reportes.map(r => r.id_reporte)) + 1 : 1,
        tipo: reporteFormData.tipo,
        fecha: new Date(reporteFormData.fecha).toISOString(),
        datos: datosJSON // Guardamos el objeto JSON parseado
      };
      setReportes([...reportes, newReporte]);
    }
    setShowReporteModal(false);
  };

  const handleDeleteReporte = (reporte) => {
    setCurrentReporte(reporte);
    setShowReporteDeleteModal(true);
  };

  const confirmDeleteReporte = () => {
    setReportes(reportes.filter(r => r.id_reporte !== currentReporte.id_reporte));
    setShowReporteDeleteModal(false);
  };
  // ============= FIN CRUD REPORTES =============

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    window.location.href = '/';
  };

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
          <button
            onClick={() => setShowOrderCRUD(true)}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
          >
            <FileText size={20} className="text-emerald-400" />
            <span className="text-sm">Gestión de pedidos</span>
          </button>
          <button
            onClick={() => setShowProductCRUD(true)}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
          >
            <Package size={20} className="text-emerald-400" />
            <span className="text-sm">Gestión de productos</span>
          </button>
          <button
            onClick={() => setShowReservaCRUD(true)}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
          >
            <Bookmark size={20} className="text-emerald-400" />
            <span className="text-sm">Gestión de reservas</span>
          </button>
          <button
            onClick={() => setShowClienteCRUD(true)}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
          >
            <Users size={20} className="text-emerald-400" />
            <span className="text-sm">Gestión de clientes</span>
          </button>
          <button
            onClick={() => setShowReporteCRUD(true)}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
          >
            <FileText size={20} className="text-emerald-400" />
            <span className="text-sm">Gestión de reportes</span>
          </button>
        </nav>

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
        <header className="bg-white shadow-sm p-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            👋 Bienvenido, {usuario.nombre}
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
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Ventas diarias</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dailySalesData}>
                  <Bar dataKey="sales" fill="#10B981" radius={[8, 8, 0, 0]} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>

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
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Alertas / Notificaciones</h3>
              <div className="space-y-3">
                {alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg ${alert.type === 'danger' ? 'bg-red-50' : 'bg-yellow-50'}`}
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

      {/* Modal de CRUD de Productos */}
      {showProductCRUD && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 pl-48">
          <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col ml-4">
            {/* Header del modal */}
            <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-orange-500" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Gestión de Productos</h2>
                  <p className="text-gray-600 text-sm">Administra el inventario de productos del restaurante</p>
                </div>
              </div>
              <button
                onClick={() => setShowProductCRUD(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="flex-1 overflow-auto p-6">
              {/* Barra de acciones */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleCreate}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Nuevo Producto
                </button>
              </div>

              {/* Tabla de productos */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Producto</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Categoría</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Precio</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{product.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {product.categoria}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                            ${product.precio.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 20 ? 'bg-green-100 text-green-800' :
                              product.stock > 10 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                              {product.stock} unidades
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                              {product.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center gap-1"
                            >
                              <Edit2 className="w-4 h-4" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(product)}
                              className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No se encontraron productos</p>
                    <p className="text-gray-400 text-sm">
                      {products.length === 0 ? 'Agrega tu primer producto' : 'Intenta con otro término de búsqueda'}
                    </p>
                  </div>
                )}
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <p className="text-gray-600 text-sm">Total de productos</p>
                  <p className="text-2xl font-bold text-gray-800">{products.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <p className="text-gray-600 text-sm">Productos activos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {products.filter(p => p.estado === 'Activo').length}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <p className="text-gray-600 text-sm">Stock bajo (&lt;10)</p>
                  <p className="text-2xl font-bold text-red-600">
                    {products.filter(p => p.stock < 10).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear/Editar Producto */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {currentProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del producto *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ej: Hamburguesa Deluxe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                ¿Eliminar producto?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                ¿Estás seguro de que deseas eliminar "<strong>{currentProduct?.nombre}</strong>"? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============= MODAL DE GESTIÓN DE PEDIDOS ============= */}
      {showOrderCRUD && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 pl-48">
          <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col ml-4">
            {/* Header del modal */}
            <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-orange-500" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Gestión de Pedidos</h2>
                  <p className="text-gray-600 text-sm">Administra todos los pedidos del restaurante</p>
                </div>
              </div>
              <button
                onClick={() => setShowOrderCRUD(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="flex-1 overflow-auto p-6">
              {/* Barra de acciones */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar pedidos..."
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleCreateOrder}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Nuevo Pedido
                </button>
              </div>

              {/* Tabla de pedidos */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Pedido</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Cliente</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Empleado</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha y Hora</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <tr key={order.id_pedido} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id_pedido}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Cliente #{order.id_cliente}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Empleado #{order.id_empleado}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(order.fecha_hora).toLocaleString('es-DO', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                            ${order.total.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.estado === 'Completada' ? 'bg-green-100 text-green-800' :
                              order.estado === 'Confirmada' ? 'bg-blue-100 text-blue-800' :
                                order.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                              }`}>
                              {order.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditOrder(order)}
                              className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center gap-1"
                            >
                              <Edit2 className="w-4 h-4" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order)}
                              className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredOrders.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No se encontraron pedidos</p>
                    <p className="text-gray-400 text-sm">
                      {orders.length === 0 ? 'Agrega tu primer pedido' : 'Intenta con otro término de búsqueda'}
                    </p>
                  </div>
                )}
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <p className="text-gray-600 text-sm">Total de pedidos</p>
                  <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <p className="text-gray-600 text-sm">Pedidos completados</p>
                  <p className="text-2xl font-bold text-green-600">
                    {orders.filter(o => o.estado === 'Completada').length}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <p className="text-gray-600 text-sm">Pedidos pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {orders.filter(o => o.estado === 'Pendiente').length}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <p className="text-gray-600 text-sm">Total facturado</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    ${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============= MODAL CREAR/EDITAR PEDIDO ============= */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {currentOrder ? 'Editar Pedido' : 'Nuevo Pedido'}
              </h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Cliente *
                </label>
                <input
                  type="number"
                  value={orderFormData.id_cliente}
                  onChange={(e) => setOrderFormData({ ...orderFormData, id_cliente: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ej: 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Empleado *
                </label>
                <input
                  type="number"
                  value={orderFormData.id_empleado}
                  onChange={(e) => setOrderFormData({ ...orderFormData, id_empleado: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ej: 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={orderFormData.total}
                  onChange={(e) => setOrderFormData({ ...orderFormData, total: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={orderFormData.estado}
                  onChange={(e) => setOrderFormData({ ...orderFormData, estado: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Completada">Completada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowOrderModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveOrder}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============= MODAL ELIMINAR PEDIDO ============= */}
      {showOrderDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                ¿Eliminar pedido?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                ¿Estás seguro de que deseas eliminar el pedido <strong>#{currentOrder?.id_pedido}</strong>? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowOrderDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteOrder}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============= MODAL DE GESTIÓN DE RESERVAS ============= */}
      {showReservaCRUD && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 pl-48">
          <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col ml-4">
            {/* Header del modal */}
            <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Bookmark className="w-8 h-8 text-orange-500" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Gestión de Reservas</h2>
                  <p className="text-gray-600 text-sm">Administra todas las reservas del restaurante</p>
                </div>
              </div>
              <button
                onClick={() => setShowReservaCRUD(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="flex-1 overflow-auto p-6">
              {/* Barra de acciones */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar reservas..."
                    value={reservaSearchTerm}
                    onChange={(e) => setReservaSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleCreateReserva}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Nueva Reserva
                </button>
              </div>

              {/* Tabla de reservas */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Reserva</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Cliente</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Mesa</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha y Hora</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredReservas.map((reserva) => (
                        <tr key={reserva.id_reserva} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{reserva.id_reserva}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Cliente #{reserva.id_cliente}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Mesa #{reserva.id_mesa}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(reserva.fecha_hora).toLocaleString('es-DO', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${reserva.estado === 'Completada' ? 'bg-green-100 text-green-800' :
                              reserva.estado === 'Confirmada' ? 'bg-blue-100 text-blue-800' :
                                reserva.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                              }`}>
                              {reserva.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditReserva(reserva)}
                              className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center gap-1"
                            >
                              <Edit2 className="w-4 h-4" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteReserva(reserva)}
                              className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredReservas.length === 0 && (
                  <div className="text-center py-12">
                    <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No se encontraron reservas</p>
                    <p className="text-gray-400 text-sm">
                      {reservas.length === 0 ? 'Agrega tu primera reserva' : 'Intenta con otro término de búsqueda'}
                    </p>
                  </div>
                )}
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <p className="text-gray-600 text-sm">Total de reservas</p>
                  <p className="text-2xl font-bold text-gray-800">{reservas.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <p className="text-gray-600 text-sm">Reservas completadas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {reservas.filter(r => r.estado === 'Completada').length}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <p className="text-gray-600 text-sm">Reservas pendientes</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {reservas.filter(r => r.estado === 'Pendiente').length}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <p className="text-gray-600 text-sm">Reservas canceladas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {reservas.filter(r => r.estado === 'Cancelada').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============= MODAL CREAR/EDITAR RESERVA ============= */}
      {showReservaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {currentReserva ? 'Editar Reserva' : 'Nueva Reserva'}
              </h2>
              <button
                onClick={() => setShowReservaModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Cliente *
                </label>
                <input
                  type="number"
                  value={reservaFormData.id_cliente}
                  onChange={(e) => setReservaFormData({ ...reservaFormData, id_cliente: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ej: 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Mesa *
                </label>
                <input
                  type="number"
                  value={reservaFormData.id_mesa}
                  onChange={(e) => setReservaFormData({ ...reservaFormData, id_mesa: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ej: 5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha y Hora *
                </label>
                <input
                  type="datetime-local"
                  value={reservaFormData.fecha_hora}
                  onChange={(e) => setReservaFormData({ ...reservaFormData, fecha_hora: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={reservaFormData.estado}
                  onChange={(e) => setReservaFormData({ ...reservaFormData, estado: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Completada">Completada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowReservaModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveReserva}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============= MODAL ELIMINAR RESERVA ============= */}
      {showReservaDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                ¿Eliminar reserva?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                ¿Estás seguro de que deseas eliminar la reserva <strong>#{currentReserva?.id_reserva}</strong>? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReservaDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteReserva}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============= MODAL DE GESTIÓN DE CLIENTES ============= */}
      {showClienteCRUD && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 pl-48">
          <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col ml-4">
            {/* Header del modal */}
            <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-orange-500" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h2>
                  <p className="text-gray-600 text-sm">Administra todos los clientes del restaurante</p>
                </div>
              </div>
              <button
                onClick={() => setShowClienteCRUD(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="flex-1 overflow-auto p-6">
              {/* Barra de acciones */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por teléfono, dirección, ID Usuario..."
                    value={clienteSearchTerm}
                    onChange={(e) => setClienteSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleCreateCliente}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Nuevo Cliente
                </button>
              </div>

              {/* Tabla de clientes */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Cliente</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Usuario</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Teléfono</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Dirección</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredClientes.map((cliente) => (
                        <tr key={cliente.id_cliente} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{cliente.id_cliente}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Usuario #{cliente.id_usuario}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {cliente.telefono}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {cliente.direccion}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditCliente(cliente)}
                              className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center gap-1"
                            >
                              <Edit2 className="w-4 h-4" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteCliente(cliente)}
                              className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredClientes.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No se encontraron clientes</p>
                    <p className="text-gray-400 text-sm">
                      {clientes.length === 0 ? 'Agrega tu primer cliente' : 'Intenta con otro término de búsqueda'}
                    </p>
                  </div>
                )}
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <p className="text-gray-600 text-sm">Total de clientes</p>
                  <p className="text-2xl font-bold text-gray-800">{clientes.length}</p>
                </div>
                {/* Puedes añadir más estadísticas si en el futuro agregas un campo 'estado' o 'fecha_registro' */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============= MODAL CREAR/EDITAR CLIENTE ============= */}
      {showClienteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {currentCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>
              <button
                onClick={() => setShowClienteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Usuario *
                </label>
                <input
                  type="number"
                  value={clienteFormData.id_usuario}
                  onChange={(e) => setClienteFormData({ ...clienteFormData, id_usuario: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ej: 1 (ID del usuario que inicia sesión)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="text"
                  value={clienteFormData.telefono}
                  onChange={(e) => setClienteFormData({ ...clienteFormData, telefono: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ej: 809-123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  value={clienteFormData.direccion}
                  onChange={(e) => setClienteFormData({ ...clienteFormData, direccion: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Ej: Calle 123, Sector"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowClienteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCliente}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============= MODAL ELIMINAR CLIENTE ============= */}
      {showClienteDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                ¿Eliminar cliente?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                ¿Estás seguro de que deseas eliminar al cliente <strong>#{currentCliente?.id_cliente}</strong> (Tel: {currentCliente?.telefono})? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClienteDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteCliente}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============= MODAL DE GESTIÓN DE REPORTES ============= */}
      {showReporteCRUD && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 pl-48">
          <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col ml-4">
            {/* Header del modal */}
            <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-orange-500" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Gestión de Reportes</h2>
                  <p className="text-gray-600 text-sm">Administra todos los reportes generados</p>
                </div>
              </div>
              <button
                onClick={() => setShowReporteCRUD(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="flex-1 overflow-auto p-6">
              {/* Barra de acciones */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por tipo de reporte..."
                    value={reporteSearchTerm}
                    onChange={(e) => setReporteSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleCreateReporte}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Nuevo Reporte
                </button>
              </div>

              {/* Tabla de reportes */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID Reporte</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredReportes.map((reporte) => (
                        <tr key={reporte.id_reporte} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{reporte.id_reporte}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {reporte.tipo}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(reporte.fecha).toLocaleString('es-DO', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditReporte(reporte)}
                              className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center gap-1"
                            >
                              <Edit2 className="w-4 h-4" />
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteReporte(reporte)}
                              className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredReportes.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No se encontraron reportes</p>
                    <p className="text-gray-400 text-sm">
                      {reportes.length === 0 ? 'Agrega tu primer reporte' : 'Intenta con otro término de búsqueda'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============= MODAL CREAR/EDITAR REPORTE ============= */}
      {showReporteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          {/* Modal más ancho para el campo JSON */}
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {currentReporte ? 'Editar Reporte' : 'Nuevo Reporte'}
              </h2>
              <button
                onClick={() => setShowReporteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Reporte *
                  </label>
                  <select
                    value={reporteFormData.tipo}
                    onChange={(e) => setReporteFormData({ ...reporteFormData, tipo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {tiposDeReporte.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha y Hora *
                  </label>
                  <input
                    type="datetime-local"
                    value={reporteFormData.fecha}
                    onChange={(e) => setReporteFormData({ ...reporteFormData, fecha: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Datos (en formato JSON) *
                </label>
                <textarea
                  value={reporteFormData.datos}
                  onChange={(e) => setReporteFormData({ ...reporteFormData, datos: e.target.value })}
                  className="w-full h-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-sm"
                  placeholder='{ "clave": "valor", "total_ventas": 1500 }'
                />
                <p className="text-xs text-gray-500 mt-1">Debe ser un formato JSON válido.</p>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowReporteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveReporte}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============= MODAL ELIMINAR REPORTE ============= */}
      {showReporteDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                ¿Eliminar reporte?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                ¿Estás seguro de que deseas eliminar el reporte de <strong>{currentReporte?.tipo}</strong> (ID: #{currentReporte?.id_reporte})? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReporteDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteReporte}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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