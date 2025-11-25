import { BarChart, Bar, XAxis, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Tooltip, YAxis, CartesianGrid, LineChart, Line, Legend, ReferenceLine } from 'recharts';
import { FileText, DollarSign, Users, CreditCard, Plus, AlertTriangle, ChevronRight, LogOut, Search, Edit2, Trash2, X, Save, Package, Bookmark, BrainCircuit, RefreshCw, Calendar, Clock, TrendingUp, Lightbulb, Activity, Sun, Snowflake, CloudSun, Leaf } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePredictions } from '../hooks/usePredictions'; 

// --- HELPER FUNCTIONS ---
function formatDateTimeLocal(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  const pad = (num) => String(num).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getSeasonAndType(date) {
  const month = date.getMonth(); 
  
  // Estaciones (Aproximación Hemisferio Norte para ejemplo)
  let season = 'Invierno';
  let icon = Snowflake;
  if (month >= 2 && month <= 4) { season = 'Primavera'; icon = Leaf; }
  else if (month >= 5 && month <= 7) { season = 'Verano'; icon = Sun; }
  else if (month >= 8 && month <= 10) { season = 'Otoño'; icon = CloudSun; }

  // Temporada Comercial
  let type = 'Media';
  if (month === 11 || month === 0 || month === 6 || month === 7) type = 'Alta';
  else if (month === 1 || month === 2 || month === 8 || month === 9) type = 'Baja';

  return { season, icon, type };
}

// --- COMPONENTES CRUD ---

function CRUDModal({ title, icon: Icon, endpoint, onClose, fields }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});

  const rolesPermitidos = ['cliente', 'empleado', 'administrador'];
  const estadosMesa = ['Disponible', 'Reservada', 'Limpieza pendiente'];
  const estadosPedido = ['Pendiente', 'En preparación', 'Listo para entrega', 'Completado', 'Cancelado'];

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/${endpoint}`);
      if (!response.ok) throw new Error(`Error al cargar ${title.toLowerCase()}`);
      setItems(await response.json());
    } catch (error) {
      console.error(error);
      alert(`No se pudieron cargar los ${title.toLowerCase()}`);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, title]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const getIdKey = () => `id_${endpoint.slice(0, -1)}`;
  
  const getIdField = (item) => {
    const idKey = getIdKey();
    return item[idKey];
  };

  const filteredItems = items.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleCreate = () => {
    setCurrentItem(null);
    const initialData = {};
    fields.forEach(field => initialData[field] = '');
    if (endpoint === 'usuarios') {
      initialData['contraseña'] = '';
    }
    setFormData(initialData);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    const editData = {};
    fields.forEach(field => {
      let value = item[field] || '';
      if (field.includes('fecha') || field.includes('hora')) {
        value = formatDateTimeLocal(value);
      }
      editData[field] = value;
    });

    if (endpoint === 'usuarios') {
      editData['contraseña'] = '';
    }
    setFormData(editData);
    setShowModal(true);
  };

  const handleSave = async () => {
    const isUpdating = !!currentItem;
    const idKey = getIdKey();
    const idValue = currentItem ? currentItem[idKey] : null;

    if (isUpdating && !idValue) {
      alert("Error de aplicación: No se pudo determinar el ID para actualizar.");
      return;
    }

    const url = isUpdating ? `http://localhost:5000/${endpoint}/${idValue}` : `http://localhost:5000/${endpoint}`;
    const method = isUpdating ? 'PUT' : 'POST';
    let dataToSend = { ...formData };

    if (!isUpdating) {
      delete dataToSend[idKey];
    }
    if (isUpdating && endpoint === 'usuarios' && dataToSend.contraseña === '') {
      delete dataToSend.contraseña;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || errData.message || (isUpdating ? 'Error al actualizar' : 'Error al crear'));
      }
      setShowModal(false);
      fetchItems();
    } catch (error) {
      console.error(error);
      alert(`Error: No se pudo ${isUpdating ? 'actualizar' : 'crear'} el elemento. Detalle: ${error.message}`);
    }
  };

  const handleDelete = (item) => {
    setCurrentItem(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!currentItem) return;
    const idKey = getIdKey();
    const idValue = currentItem[idKey];
    try {
      const response = await fetch(`http://localhost:5000/${endpoint}/${idValue}`, { method: 'DELETE' });
      if (!response.ok && response.status !== 204) {
        const errData = await response.json();
        throw new Error(errData.detalle || errData.message || 'Error al eliminar');
      }
      setShowDeleteModal(false);
      fetchItems();
    } catch (error) {
      console.error(error);
      alert(`Error: No se pudo eliminar el elemento. Detalle: ${error.message}`);
    }
  };

  const formatLabel = (field) => {
    const cleaned = field.replace(/_/g, ' ');
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 pl-48">
        <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col ml-4">
          <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Icon className="w-8 h-8 text-orange-500" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Gestión de {title}</h2>
                <p className="text-gray-600 text-sm">Administra todos los {title.toLowerCase()} del sistema</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Buscar ${title.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <button onClick={handleCreate} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Plus className="w-5 h-5" />
                Nuevo
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                      {fields.map(field => (
                        <th key={field} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{formatLabel(field)}</th>
                      ))}
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {isLoading ? (
                      <tr><td colSpan={fields.length + 2} className="text-center py-12 text-gray-500">Cargando...</td></tr>
                    ) : filteredItems.length > 0 ? (
                      filteredItems.map((item) => {
                        const idValue = getIdField(item);
                        return (
                          <tr key={idValue} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{idValue}</td>
                            {fields.map(field => (
                              <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item[field]}</td>
                            ))}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center gap-1">
                                <Edit2 className="w-4 h-4" />Editar
                              </button>
                              <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-900 inline-flex items-center gap-1">
                                <Trash2 className="w-4 h-4" />Eliminar
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={fields.length + 2} className="text-center py-12">
                          <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">No se encontraron {title.toLowerCase()}</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <p className="text-gray-600 text-sm">Total de {title.toLowerCase()}: <span className="font-bold">{items.length}</span></p>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">{currentItem ? `Editar ${title}` : `Nuevo ${title}`}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {fields.map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{formatLabel(field)} *</label>
                  {(title === "Usuarios" && field === "rol") || (title === "Mesas" && field === "estado") || (title === "Pedidos" && field === "estado") ? (
                    <select
                      name={field}
                      value={formData[field] || ''}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="" disabled>Seleccione {field === 'rol' ? 'un rol' : 'estado'}...</option>
                      {(title === "Usuarios" && field === "rol" ? rolesPermitidos : title === "Mesas" ? estadosMesa : estadosPedido).map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : field.includes('fecha') || field.includes('hora') ? (
                    <input
                      type="datetime-local"
                      name={field}
                      value={formData[field] || ''}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  ) : (
                    <input
                      type={field.includes('email') ? 'email' : field.includes('contraseña') ? 'password' : field.includes('id_') || field.includes('precio') || field.includes('stock') || field.includes('capacidad') || field.includes('salario') || field.includes('total') ? 'number' : 'text'}
                      name={field}
                      value={formData[field] || ''}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder={`Ingrese ${formatLabel(field).toLowerCase()}`}
                      required={!currentItem || field !== 'contraseña'}
                    />
                  )}
                </div>
              ))}

              {title === "Usuarios" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    Contraseña {currentItem ? '(Opcional: Dejar vacío para no cambiar)' : '*'}
                  </label>
                  <input
                    type='password'
                    name='contraseña'
                    value={formData['contraseña'] || ''}
                    onChange={(e) => setFormData({ ...formData, ['contraseña']: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder={currentItem ? 'Nueva contraseña' : 'Ingrese contraseña'}
                    required={!currentItem}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancelar
              </button>
              <button onClick={handleSave} className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Save className="w-4 h-4" />Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">¿Eliminar elemento?</h3>
              <p className="text-gray-600 text-center mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --- COMPONENTES CRUD ESPECÍFICOS ---

function ProductCRUDModal({ onClose }) {
  return <CRUDModal title="Productos" icon={Package} endpoint="productos" onClose={onClose} fields={['nombre', 'categoria', 'precio', 'stock']} />;
}

function OrderCRUDModal({ onClose }) {
  return <CRUDModal title="Pedidos" icon={FileText} endpoint="pedidos" onClose={onClose} fields={['id_cliente', 'id_empleado', 'fecha_hora', 'total', 'estado']} />;
}

function ReservaCRUDModal({ onClose }) {
  return <CRUDModal title="Reservas" icon={Bookmark} endpoint="reservas" onClose={onClose} fields={['id_cliente', 'id_mesa', 'fecha_hora']} />;
}

function ClienteCRUDModal({ onClose }) {
  return <CRUDModal title="Clientes" icon={Users} endpoint="clientes" onClose={onClose} fields={['id_usuario', 'telefono', 'direccion']} />;
}

function ReporteCRUDModal({ onClose }) {
  return <CRUDModal title="Reportes" icon={FileText} endpoint="reportes" onClose={onClose} fields={['tipo', 'fecha']} />;
}

function MesaCRUDModal({ onClose }) {
  return <CRUDModal title="Mesas" icon={CreditCard} endpoint="mesas" onClose={onClose} fields={['numero', 'capacidad', 'estado']} />;
}

function UsuarioCRUDModal({ onClose }) {
  return <CRUDModal title="Usuarios" icon={Users} endpoint="usuarios" onClose={onClose} fields={['nombre', 'email', 'rol']} />;
}

function EmpleadoCRUDModal({ onClose }) {
  return <CRUDModal title="Empleados" icon={Users} endpoint="empleados" onClose={onClose} fields={['id_usuario', 'puesto', 'salario']} />;
}

// --- COMPONENTE PRINCIPAL APP ---

function App() {
  // --- INTEGRACIÓN IA: Hooks y Estados ---
  const { obtenerPrediccionSemanal, entrenarModelo, loading: aiLoading } = usePredictions();
  const [rawAiData, setRawAiData] = useState([]); 
  const [aiFilter, setAiFilter] = useState('hours'); 
  const [aiError, setAiError] = useState(null);
  const [modelNeedsTraining, setModelNeedsTraining] = useState(false);
  const RESTAURANTE_ID = 1; 

  // Estados existentes
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [usuario] = useState({ nombre: 'Admin' });
  
  // Modales CRUD
  const [showProductCRUD, setShowProductCRUD] = useState(false);
  const [showOrderCRUD, setShowOrderCRUD] = useState(false);
  const [showReservaCRUD, setShowReservaCRUD] = useState(false);
  const [showClienteCRUD, setShowClienteCRUD] = useState(false);
  const [showReporteCRUD, setShowReporteCRUD] = useState(false);
  const [showMesaCRUD, setShowMesaCRUD] = useState(false);
  const [showUsuarioCRUD, setShowUsuarioCRUD] = useState(false);
  const [showEmpleadoCRUD, setShowEmpleadoCRUD] = useState(false);

  
  const loadPredictions = useCallback(async () => {
    try {
      setAiError(null);
      console.log("Solicitando predicciones al backend...");
      
      const response = await obtenerPrediccionSemanal(RESTAURANTE_ID);
      console.log("Respuesta recibida:", response);

      const predicciones = response.predicciones || response.data?.predicciones;

      if (predicciones && predicciones.length > 0) {
        setRawAiData(predicciones);
        setModelNeedsTraining(false);
      } else {
        console.warn("La respuesta no tiene predicciones o está vacía");
        setRawAiData([]);
      }
    } catch (error) {
      console.error("Error cargando predicciones:", error);
      if (error.message && (error.message.includes("404") || error.message.includes("Modelo no encontrado"))) {
        setModelNeedsTraining(true);
      } else {
        setAiError("Error de conexión con IA");
      }
    }
  }, [obtenerPrediccionSemanal]);

  // --- PROCESAMIENTO DE DATOS SEGÚN FILTRO ---
  const chartData = useMemo(() => {
    if (!rawAiData || rawAiData.length === 0) return [];

    if (aiFilter === 'hours') {
      // Muestra las próximas 24 horas (detalle horario)
      return rawAiData.slice(0, 24).map(p => ({
        label: `${String(p.hora).padStart(2, '0')}:00`,
        value: Math.round(Number(p.demanda_predicha)), 
      }));
    } 
    
    if (aiFilter === 'days') {
      // Agrupa por día de la semana (Próximos 7 días)
      const daysMap = {};
      rawAiData.forEach(p => {
        const date = new Date(p.fecha);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() + userTimezoneOffset);
        
        const dayName = localDate.toLocaleDateString('es-ES', { weekday: 'short' });
        const key = `${dayName} ${localDate.getDate()}`; 
        
        if (!daysMap[key]) daysMap[key] = 0;
        daysMap[key] += Number(p.demanda_predicha);
      });

      return Object.keys(daysMap).map(key => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: Math.round(daysMap[key])
      })).slice(0, 7);
    }

    if (aiFilter === 'monthly') {
      // PROYECCIÓN MENSUAL (Simulación inteligente basada en la semana actual)
      // Como el backend solo da 7 días, proyectamos el ciclo semanal a 30 días
      const monthlyData = [];
      const currentData = rawAiData.slice(0, 168); // 7 days data
      
      // Calcular promedio por día de la semana (0-6) de los datos reales disponibles
      const dailyTotals = {};
      currentData.forEach(p => {
         const d = new Date(p.fecha);
         const userTimezoneOffset = d.getTimezoneOffset() * 60000;
         const localDate = new Date(d.getTime() + userTimezoneOffset);
         const day = localDate.getDay();
         if (!dailyTotals[day]) dailyTotals[day] = 0;
         dailyTotals[day] += Number(p.demanda_predicha);
      });

      // Generar 30 días proyectados
      const startDate = new Date();
      for (let i = 0; i < 30; i++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + i);
          const dayOfWeek = date.getDay();
          
          // Obtener info de Estación y Temporada
          const { season, type } = getSeasonAndType(date);

          // Valor base del día de la semana
          let val = dailyTotals[dayOfWeek] || 0;
          
          // Aplicar factor de "Temporada Alta" si aplica (Simulación visual)
          if (type === 'Alta') val *= 1.2;
          if (type === 'Baja') val *= 0.9;

          const variance = 0.9 + Math.random() * 0.2;
          val = Math.round(val * variance);

          monthlyData.push({
              label: `${date.getDate()}/${date.getMonth()+1}`,
              value: val,
              season,
              type
          });
      }
      return monthlyData;
    }

    return [];
  }, [rawAiData, aiFilter]);

  // --- CÁLCULO DE INSIGHTS ---
  const aiInsights = useMemo(() => {
    if (!chartData || chartData.length === 0) return null;

    const maxPoint = chartData.reduce((max, p) => p.value > max.value ? p : max, chartData[0]);
    const minPoint = chartData.reduce((min, p) => (p.value < min.value && p.value > 0) ? p : min, chartData[0]);
    const totalExpected = chartData.reduce((sum, p) => sum + p.value, 0);

    if (aiFilter === 'hours') {
      return {
        title: 'Estimación para hoy',
        items: [
          { icon: <Activity size={14} />, text: `Pico probable: ${maxPoint.label} (~${maxPoint.value} pedidos)` },
          { icon: <Users size={14} />, text: maxPoint.value > 20 ? 'Podría requerirse apoyo en cocina' : 'Carga de trabajo estimada: Normal' },
          { icon: <TrendingUp size={14} />, text: `Proyección diaria: ~${totalExpected} pedidos` }
        ]
      };
    } else if (aiFilter === 'days') {
      return {
        title: 'Proyección Semanal',
        items: [
          { icon: <Calendar size={14} />, text: `Día de mayor actividad: ${maxPoint.label} (${maxPoint.value} pedidos)` },
          { icon: <Package size={14} />, text: `Sugerencia: Revisar stock para el ${maxPoint.label}` },
          { icon: <Activity size={14} />, text: `Día de menor actividad: ${minPoint.label}` }
        ]
      };
    } else {
      const currentSeason = chartData[0]?.season || 'General';
      const currentType = chartData[0]?.type || 'Media';
      return {
        title: `Tendencia del Mes (${currentSeason})`,
        items: [
          { icon: <Calendar size={14} />, text: `Temporada estimada: ${currentType}` },
          { icon: <TrendingUp size={14} />, text: `Estimación mensual: ~${totalExpected} pedidos` },
          { icon: <Lightbulb size={14} />, text: currentType === 'Alta' ? 'Posible aumento sostenido de flujo' : 'Oportunidad para activar promociones' }
        ]
      };
    }
  }, [chartData, aiFilter, rawAiData]);

  const handleTrainModel = async () => {
    try {
      await entrenarModelo(RESTAURANTE_ID);
      alert("Modelo entrenado correctamente. Recargando predicciones...");
      loadPredictions();
    } catch (error) {
      alert("Error al entrenar: " + error.message);
    }
  };

  useEffect(() => {
    loadPredictions();
  }, [loadPredictions]);

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    window.location.href = '/';
  };

  // Datos estáticos para otras gráficas
  const dailySalesData = [
    { day: 'L', sales: 220 }, { day: 'M', sales: 280 }, { day: 'M', sales: 250 },
    { day: 'J', sales: 240 }, { day: 'S', sales: 270 }, { day: 'S', sales: 310 }
  ];
  const categoryData = [
    { name: 'Hamburguesas', value: 35, color: '#EF4444' }, { name: 'Pizza', value: 25, color: '#F97316' },
    { name: 'Sushi', value: 20, color: '#10B981' }, { name: 'Ensaladas', value: 20, color: '#14B8A6' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-48 bg-gray-900 text-white p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="text-orange-500 text-2xl font-bold">ClickFood</div>
        </div>
        <nav className="space-y-2 flex-1">
          <button onClick={() => setShowOrderCRUD(true)} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left">
            <FileText size={20} className="text-emerald-400" />
            <span className="text-sm">Gestión de pedidos</span>
          </button>
          <button onClick={() => setShowProductCRUD(true)} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left">
            <Package size={20} className="text-emerald-400" />
            <span className="text-sm">Gestión de productos</span>
          </button>
          <button onClick={() => setShowReservaCRUD(true)} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left">
            <Bookmark size={20} className="text-emerald-400" />
            <span className="text-sm">Gestión de reservas</span>
          </button>
          <button onClick={() => setShowClienteCRUD(true)} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left">
            <Users size={20} className="text-emerald-400" />
            <span className="text-sm">Gestión de clientes</span>
          </button>
          <button onClick={() => setShowReporteCRUD(true)} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left">
            <FileText size={20} className="text-emerald-400" />
            <span className="text-sm">Gestión de reportes</span>
          </button>
          <button onClick={() => setShowMesaCRUD(true)} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left">
            <CreditCard size={20} className="text-emerald-400" />
            <span className="text-sm">Gestión de mesas</span>
          </button>
          <button onClick={() => setShowUsuarioCRUD(true)} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left">
            <Users size={20} className="text-emerald-400" />
            <span className="text-sm">Gestión de usuarios</span>
          </button>
          <button onClick={() => setShowEmpleadoCRUD(true)} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left">
            <Users size={20} className="text-emerald-400" />
            <span className="text-sm">Gestión de empleados</span>
          </button>
        </nav>
        <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-600 bg-red-500 transition-colors text-left mt-4">
          <LogOut size={20} />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Bienvenido, {usuario.nombre}</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium">320</span>
            <button onClick={() => setShowLogoutConfirm(true)} className="text-gray-600 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-gray-100">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <FileText size={24} />
                <div className="text-sm opacity-90">Pedidos del día</div>
              </div>
              <div className="text-4xl font-bold">45</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2"><DollarSign size={24} /><div className="text-sm opacity-90">Ingresos hoy</div></div>
              <div className="text-4xl font-bold">$12,350</div>
            </div>
            <div className="bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2"><Users size={24} /><div className="text-sm opacity-90">Clientes activos</div></div>
              <div className="text-4xl font-bold">320</div>
            </div>
            <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2"><CreditCard size={24} /><div className="text-sm opacity-90">Reservas próximas</div></div>
              <div className="text-4xl font-bold">8</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Ventas diarias</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dailySalesData} margin={{ top: 20 }}>
                  <Bar 
                    dataKey="sales" 
                    fill="#10B981" 
                    radius={[8, 8, 0, 0]} 
                    label={{ position: 'top', fill: '#666', fontSize: 12 }} 
                  />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <Tooltip />
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
                    label={({name, value}) => `${value}`}
                  >
                    {categoryData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* --- SECCIÓN INTEGRADA IA (CON FILTROS) --- */}
            <div className="bg-white rounded-xl p-6 shadow-sm relative overflow-hidden min-h-[420px]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                      <BrainCircuit className="text-emerald-500" size={20} />
                      <h3 className="text-lg font-semibold text-gray-800">{aiInsights ? aiInsights.title : 'Predicción de Demanda'}</h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Pronóstico de ventas considerando horarios, días pico y estacionalidad.
                  </p>
                </div>
                
                {/* BOTONES DE FILTRO */}
                {!modelNeedsTraining && !aiError && rawAiData.length > 0 && (
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                      onClick={() => setAiFilter('hours')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${aiFilter === 'hours' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <Clock size={14} /> Horarios
                    </button>
                    <button 
                      onClick={() => setAiFilter('days')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${aiFilter === 'days' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <Calendar size={14} /> Días
                    </button>
                    <button 
                      onClick={() => setAiFilter('monthly')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${aiFilter === 'monthly' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <TrendingUp size={14} /> Mensual
                    </button>
                  </div>
                )}
              </div>

              <div className="relative h-[220px] w-full">
                {aiLoading && (
                  <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                      <RefreshCw className="animate-spin" size={18} /> Calculando...
                    </div>
                  </div>
                )}

                {modelNeedsTraining ? (
                  <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <p className="text-gray-500 text-sm mb-3">El modelo necesita entrenamiento</p>
                      <button 
                          onClick={handleTrainModel} 
                          disabled={aiLoading}
                          className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-600 transition flex items-center gap-2 shadow-sm"
                      >
                          <BrainCircuit size={16} />
                          {aiLoading ? 'Entrenando...' : 'Entrenar Modelo'}
                      </button>
                  </div>
                ) : aiError ? (
                  <div className="h-full flex flex-col items-center justify-center text-red-400 text-sm bg-red-50 rounded-lg">
                      <AlertTriangle size={24} className="mb-2" />
                      {aiError}
                  </div>
                ) : chartData.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-lg">
                      <p>No hay datos de predicción disponibles.</p>
                      <button onClick={loadPredictions} className="mt-2 text-blue-500 hover:underline text-xs">Reintentar</button>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                      {aiFilter === 'days' ? (
                        // GRÁFICA DE BARRAS PARA DÍAS
                        <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="label" fontSize={10} axisLine={false} tickLine={false} />
                          <YAxis fontSize={10} axisLine={false} tickLine={false} />
                          <Tooltip 
                              cursor={{ fill: '#f3f4f6' }}
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar 
                            dataKey="value" 
                            fill="#10B981" 
                            radius={[4, 4, 0, 0]} 
                            name="Pedidos esperados" 
                            label={{ position: 'top', fill: '#374151', fontSize: 10 }}
                          />
                        </BarChart>
                      ) : (
                        // GRÁFICA DE ÁREA PARA HORAS Y MENSUAL
                        <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                              <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis 
                              dataKey="label" 
                              fontSize={10} 
                              axisLine={false} 
                              tickLine={false} 
                              interval={aiFilter === 'monthly' ? 6 : 'preserveStartEnd'}
                          />
                          <YAxis fontSize={10} axisLine={false} tickLine={false} />
                          <Tooltip 
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                              formatter={(value, name, props) => {
                                if (aiFilter === 'monthly') {
                                  return [`${value} pedidos`, `${props.payload.type} (${props.payload.season})`];
                                }
                                return [`${value} pedidos`, 'Demanda'];
                              }}
                          />
                          <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#10B981" 
                              strokeWidth={3} 
                              fill="url(#demandGradient)" 
                              animationDuration={1500}
                              label={aiFilter !== 'monthly' ? { position: 'top', fill: '#10B981', fontSize: 10 } : false}
                          />
                        </AreaChart>
                      )}
                  </ResponsiveContainer>
                )}
              </div>

              {/* --- INSIGHTS DE IA --- */}
              {aiInsights && (
                <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                  <h4 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                    <Lightbulb size={16} /> {aiFilter === 'monthly' ? 'Observaciones del Mes' : 'Observaciones'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {aiInsights.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-emerald-700">
                        {item.icon}
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {}

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Alertas / Notificaciones</h3>
              <div className="space-y-3">
                {[
                  { type: 'warning', message: '2 Mesas pendientes de limpiar' },
                  { type: 'warning', message: 'Papas fritas: 5 unidades restantes' },
                  { type: 'danger', message: '12 Pagos pendientes de confirmación' }
                ].map((alert, idx) => (
                  <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${alert.type === 'danger' ? 'bg-red-50' : 'bg-yellow-50'}`}>
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
                {[
                  { name: 'Manuel García', table: 'Mesa 5', date: '08/02', time: '07:06' },
                  { name: 'Valeria Ramos', table: 'Mesa 8', date: '08/02', time: '15:30' },
                  { name: 'Felipe Santos', table: 'Mesa 3', date: '08/02', time: '19:00' }
                ].map((res, idx) => (
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
                  {[
                    { name: 'Manuel García', date: '15/02/2044', status: 'Confirmada' },
                    { name: 'Valeria Ramos', date: '16/02/2044', status: 'Pendiente' },
                    { name: 'Felipe Santos', date: '18/02/2044', status: 'Completada' }
                  ].map((order, idx) => (
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
                  {[
                    { name: 'Hamburguesa', price: '$5.500' },
                    { name: 'Enchiladas', price: '$1.250' },
                    { name: 'Sushi', price: '$980' },
                    { name: 'Pizza', price: '$650' },
                    { name: 'Ensalada', price: '$250' }
                  ].map((product, idx) => (
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

      {showProductCRUD && <ProductCRUDModal onClose={() => setShowProductCRUD(false)} />}
      {showOrderCRUD && <OrderCRUDModal onClose={() => setShowOrderCRUD(false)} />}
      {showReservaCRUD && <ReservaCRUDModal onClose={() => setShowReservaCRUD(false)} />}
      {showClienteCRUD && <ClienteCRUDModal onClose={() => setShowClienteCRUD(false)} />}
      {showReporteCRUD && <ReporteCRUDModal onClose={() => setShowReporteCRUD(false)} />}
      {showMesaCRUD && <MesaCRUDModal onClose={() => setShowMesaCRUD(false)} />}
      {showUsuarioCRUD && <UsuarioCRUDModal onClose={() => setShowUsuarioCRUD(false)} />}
      {showEmpleadoCRUD && <EmpleadoCRUDModal onClose={() => setShowEmpleadoCRUD(false)} />}

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <LogOut className="text-red-500" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Cerrar sesión</h2>
            </div>
            <p className="text-gray-600 mb-6">¿Estás seguro de que deseas cerrar sesión?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">Cancelar</button>
              <button onClick={handleLogout} className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium">Cerrar sesión</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;