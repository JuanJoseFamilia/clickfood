import { API_URL } from '../config';
import { BarChart, Bar, XAxis, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Tooltip, YAxis, CartesianGrid} from 'recharts';
import { FileText, DollarSign, Users, CreditCard, Plus, AlertTriangle, LogOut, Search, Edit2, Trash2, X, Save, Package, Bookmark, BrainCircuit, RefreshCw, Calendar, Clock, TrendingUp, Activity, Sun, Snowflake, CloudSun, Leaf } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Menu } from 'lucide-react'; 
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
  let season = 'Invierno';
  let icon = Snowflake;
  if (month >= 2 && month <= 4) { season = 'Primavera'; icon = Leaf; }
  else if (month >= 5 && month <= 7) { season = 'Verano'; icon = Sun; }
  else if (month >= 8 && month <= 10) { season = 'Otoño'; icon = CloudSun; }

  let type = 'Media';
  if (month === 11 || month === 0 || month === 6 || month === 7) type = 'Alta';
  else if (month === 1 || month === 2 || month === 8 || month === 9) type = 'Baja';

  return { season, icon, type };
}

// --- MODALES PERSONALIZADOS ---

function NewOrderModal({ onClose, onSaveSuccess }) {
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mesas, setMesas] = useState([]); 

  // --- ESTADOS DE SELECCIÓN MANUAL ---
  const [idCliente, setIdCliente] = useState('');
  const [idEmpleado, setIdEmpleado] = useState(''); 
  const [selectedMesaNumero, setSelectedMesaNumero] = useState('');


  const [selectedProductoId, setSelectedProductoId] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resCli, resEmp, resProd, resMesas] = await Promise.all([
          fetch(`${API_URL}/clientes`),
          fetch(`${API_URL}/empleados`),
          fetch(`${API_URL}/productos`),
          fetch(`${API_URL}/mesas`)
        ]);

        if(resCli.ok) setClientes(await resCli.json());
        if(resEmp.ok) setEmpleados(await resEmp.json());
        if(resMesas.ok) setMesas(await resMesas.json());
        
        if(resProd.ok) {
            const allProds = await resProd.json();
            const disponibles = allProds.filter(p => (parseInt(p.stock) || 0) > 0 && (!p.estado || String(p.estado).toLowerCase() !== 'inactivo'));
            setProductos(disponibles);
        }
      } catch (error) {
        console.error("Error cargando datos para pedido", error);
      }
    };
    loadData();
  }, []);

  const handleAddProduct = () => {
    if (!selectedProductoId || cantidad <= 0) return;
    const productoReal = productos.find(p => p.id_producto === parseInt(selectedProductoId));
    if (!productoReal) return;
    const subtotal = parseFloat(productoReal.precio) * parseInt(cantidad);
    
    setCart([...cart, {
      id_producto: productoReal.id_producto,
      nombre: productoReal.nombre,
      precio: parseFloat(productoReal.precio),
      cantidad: parseInt(cantidad),
      subtotal: subtotal
    }]);
    
    setSelectedProductoId('');
    setCantidad(1);
  };

  const handleRemoveItem = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const totalGeneral = cart.reduce((acc, item) => acc + item.subtotal, 0);

  const handleSaveOrder = async () => {
    if (!idCliente) return alert("Por favor seleccione un Cliente.");
    if (!idEmpleado) return alert("Por favor seleccione el Empleado que atiende.");
    if (!selectedMesaNumero) return alert("Por favor seleccione una Mesa.");
    if (cart.length === 0) return alert("Por favor agregue al menos un producto.");

    const payload = {
      id_mesa: selectedMesaNumero, 
      id_empleado: idEmpleado, 
      id_cliente: idCliente,   
      total: totalGeneral,
      productos: cart.map(item => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio: item.precio
      })),
      notas: "Pedido creado desde Web"
    };

    try {
      const response = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || err.error || "Error al guardar");
      }

      alert("Pedido creado exitosamente");
      try { window.dispatchEvent(new Event('dashboard:refresh')); } catch (e) { }
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error creando pedido: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="text-orange-500" /> Nuevo Pedido
          </h2>
          <button onClick={onClose}><X className="text-gray-400 hover:text-gray-600" /></button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cliente <span className='text-red-500'>*</span></label>
              <select className="w-full border border-gray-300 rounded-lg p-2" value={idCliente} onChange={e => setIdCliente(e.target.value)}>
                <option value="">Seleccione Cliente...</option>
                {clientes.map(c => (
                  <option key={c.id_cliente} value={c.id_cliente}>
                    {c.nombre_usuario || c.usuarios?.nombre || `Cliente #${c.id_cliente}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Empleado <span className='text-red-500'>*</span></label>
              <select className="w-full border border-gray-300 rounded-lg p-2" value={idEmpleado} onChange={e => setIdEmpleado(e.target.value)}>
                <option value="">Seleccione Empleado...</option>
                {empleados.map(e => (
                  <option key={e.id_empleado} value={e.id_empleado}>
                    {e.nombre_usuario || e.usuarios?.nombre || `Empleado #${e.id_empleado}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mesa <span className='text-red-500'>*</span></label>
              <select className="w-full border border-gray-300 rounded-lg p-2" value={selectedMesaNumero} onChange={e => setSelectedMesaNumero(e.target.value)}>
                <option value="">Seleccione Mesa...</option>
                {mesas.map(m => (
                  <option key={m.id_mesa} value={m.numero}>
                    Mesa {m.numero} (Cap: {m.capacidad})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><Plus size={16} /> Agregar Productos</h3>
          
          <div className="flex flex-col md:flex-row gap-3 items-end mb-6 border-b pb-6">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-gray-500 mb-1">Producto</label>
              <select className="w-full border border-gray-300 rounded-lg p-2" value={selectedProductoId} onChange={e => setSelectedProductoId(e.target.value)}>
                <option value="">-- Seleccionar producto --</option>
                {productos.map(p => (
                  <option key={p.id_producto} value={p.id_producto}>
                    {p.nombre} - ${p.precio}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <label className="block text-xs font-bold text-gray-500 mb-1">Cantidad</label>
              <input type="number" min="1" className="w-full border border-gray-300 rounded-lg p-2 text-center" value={cantidad} onChange={e => setCantidad(e.target.value)} />
            </div>
            <button onClick={handleAddProduct} className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 flex items-center gap-2 transition-colors">
              <Plus size={18} /> Agregar
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="p-3 text-left">Producto</th>
                  <th className="p-3 text-center">Cant.</th>
                  <th className="p-3 text-right">Precio Unit.</th>
                  <th className="p-3 text-right">Subtotal</th>
                  <th className="p-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cart.length === 0 ? (
                  <tr><td colSpan="5" className="text-center p-8 text-gray-400">El carrito está vacío</td></tr>
                ) : (
                  cart.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">{item.nombre}</td>
                      <td className="p-3 text-center">{item.cantidad}</td>
                      <td className="p-3 text-right">${item.precio}</td>
                      <td className="p-3 text-right font-bold text-emerald-600">${item.subtotal}</td>
                      <td className="p-3 text-center">
                        <button onClick={() => handleRemoveItem(index)} className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-between items-center rounded-b-lg">
          <div className="text-2xl font-bold text-gray-800">
            Total: <span className="text-orange-500">${totalGeneral}</span>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors">Cancelar</button>
            <button onClick={handleSaveOrder} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center gap-2 shadow-lg shadow-orange-500/30">
              <Save size={18} /> Guardar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewReservaModal({ onClose, onSaveSuccess }) {
  const [clientes, setClientes] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [idCliente, setIdCliente] = useState('');
  const [idMesa, setIdMesa] = useState('');
  const [fechaHora, setFechaHora] = useState('');
  const [estado, setEstado] = useState('Pendiente');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [resCli, resMesas] = await Promise.all([
          fetch(`${API_URL}/clientes`),
          fetch(`${API_URL}/mesas`)
        ]);
        setClientes(await resCli.json());
        setMesas(await resMesas.json());
      } catch (error) {
        console.error("Error cargando datos para reserva", error);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    if (!idCliente || !idMesa || !fechaHora) return alert("Por favor complete todos los campos (Cliente, Mesa, Fecha).");

    const payload = {
      id_cliente: idCliente,
      id_mesa: idMesa,
      fecha_hora: fechaHora,
      estado: estado
    };

    try {
      const response = await fetch(`${API_URL}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Error al crear reserva");
      }

      alert("Reserva creada exitosamente");
      try { window.dispatchEvent(new Event('dashboard:refresh')); } catch (e) { }
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Bookmark className="text-orange-500" /> Nueva Reserva
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <select className="w-full border rounded-lg p-2" value={idCliente} onChange={e => setIdCliente(e.target.value)}>
              <option value="">Seleccione Cliente...</option>
              {clientes.map(c => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.nombre_usuario || c.usuarios?.nombre || `Cliente #${c.id_cliente}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mesa</label>
            <select className="w-full border rounded-lg p-2" value={idMesa} onChange={e => setIdMesa(e.target.value)}>
              <option value="">Seleccione Mesa...</option>
              {mesas.map(m => (
                <option key={m.id_mesa} value={m.id_mesa}>
                  Mesa {m.numero} (Capacidad: {m.capacidad})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora</label>
            <input type="datetime-local" className="w-full border rounded-lg p-2" value={fechaHora} onChange={e => setFechaHora(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select className="w-full border rounded-lg p-2" value={estado} onChange={e => setEstado(e.target.value)}>
              <option value="Pendiente">Pendiente</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
          <button onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg hover:bg-white transition">Cancelar</button>
          <button onClick={handleSave} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">Guardar</button>
        </div>
      </div>
    </div>
  );
}

function NewClienteModal({ onClose, onSaveSuccess }) {
  const [usuarios, setUsuarios] = useState([]);
  const [idUsuario, setIdUsuario] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        const response = await fetch(`${API_URL}/usuarios`);
        if (response.ok) {
          const data = await response.json();
          setUsuarios(data);
        }
      } catch (error) {
        console.error("Error cargando usuarios", error);
      }
    };
    loadUsuarios();
  }, []);

  const handleSave = async () => {
    if (!idUsuario || !telefono || !direccion) return alert("Por favor complete todos los campos.");

    try {
      const response = await fetch(`${API_URL}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: idUsuario, telefono, direccion })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Error al crear cliente");
      }

      alert("Cliente creado exitosamente");
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-orange-500" /> Nuevo Cliente
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <select className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500" value={idUsuario} onChange={e => setIdUsuario(e.target.value)}>
              <option value="">Seleccione un usuario...</option>
              {usuarios.map(u => (
                <option key={u.id_usuario} value={u.id_usuario}>
                  {u.nombre} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Ej: 809-555-5555" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input type="text" className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500" value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Ej: Calle Principal #123" />
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
          <button onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg hover:bg-white transition">Cancelar</button>
          <button onClick={handleSave} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">Guardar</button>
        </div>
      </div>
    </div>
  );
}

function NewEmpleadoModal({ onClose, onSaveSuccess }) {
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  const [idUsuario, setIdUsuario] = useState('');
  const [puesto, setPuesto] = useState('');
  const [salario, setSalario] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [resUsuarios, resEmpleados] = await Promise.all([
          fetch(`${API_URL}/usuarios`),
          fetch(`${API_URL}/empleados`)
        ]);

        if (resUsuarios.ok && resEmpleados.ok) {
          const todosLosUsuarios = await resUsuarios.json();
          const empleadosExistentes = await resEmpleados.json();
          const idsDeEmpleados = empleadosExistentes.map(emp => emp.id_usuario);
          const disponibles = todosLosUsuarios.filter(u => 
            u.rol === 'empleado' && !idsDeEmpleados.includes(u.id_usuario)
          );
          setUsuariosDisponibles(disponibles);
        }
      } catch (error) {
        console.error("Error cargando datos", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    if (!idUsuario || !puesto || !salario) return alert("Por favor complete todos los campos.");

    try {
      const response = await fetch(`${API_URL}/empleados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: idUsuario, puesto: puesto, salario: salario })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Error al guardar");

      alert("Empleado registrado exitosamente");
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-orange-500" /> Nuevo Empleado
          </h2>
          <button onClick={onClose}><X size={24} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Usuario</label>
            <select className="w-full border rounded-lg p-2" value={idUsuario} onChange={e => setIdUsuario(e.target.value)} disabled={loading}>
              <option value="">{loading ? "Cargando..." : "-- Seleccione un usuario --"}</option>
              {!loading && usuariosDisponibles.length === 0 ? (
                 <option disabled>No hay usuarios disponibles</option>
              ) : (
                usuariosDisponibles.map(u => (
                  <option key={u.id_usuario} value={u.id_usuario}>{u.nombre} ({u.email})</option>
                ))
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Puesto</label>
            <input type="text" className="w-full border rounded-lg p-2" placeholder="Ej: Chef, Mesero..." value={puesto} onChange={e => setPuesto(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salario</label>
            <input type="number" className="w-full border rounded-lg p-2" placeholder="0.00" value={salario} onChange={e => setSalario(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
          <button onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg hover:bg-white">Cancelar</button>
          <button onClick={handleSave} disabled={usuariosDisponibles.length === 0} className={`flex-1 px-4 py-2 text-white rounded-lg transition ${usuariosDisponibles.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

function OrderDetailsModal({ pedido, onClose }) {
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/pedidos/${pedido.id_pedido}/detalle`)
      .then(res => {
        if (!res.ok) throw new Error("Error fetching details");
        return res.json();
      })
      .then(data => {
        setDetalles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [pedido]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[70]">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-orange-500 p-4 flex justify-between items-center text-white shrink-0">
          <div>
            <h3 className="font-bold text-lg">Pedido #{pedido.id_pedido}</h3>
            <span className="text-xs opacity-90">{new Date(pedido.fecha_hora).toLocaleString()}</span>
          </div>
          <button onClick={onClose} className="hover:bg-orange-600 p-1 rounded"><X size={20} /></button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Cliente</p>
              <p className="text-gray-800 font-medium">{pedido.nombre_cliente || 'No registrado'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold">Atendido por</p>
              <p className="text-gray-800 font-medium">{pedido.nombre_empleado || 'No asignado'}</p>
            </div>
          </div>
          <h4 className="font-semibold text-gray-700 mb-3">Productos del Pedido</h4>
          <table className="w-full text-sm mb-4">
            <thead className="bg-gray-100 border-b text-gray-600">
              <tr>
                <th className="p-3 text-left">Producto</th>
                <th className="p-3 text-center">Cant.</th>
                <th className="p-3 text-right">Precio Unit.</th>
                <th className="p-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="p-6 text-center text-gray-500">Cargando productos...</td></tr>
              ) : detalles.length > 0 ? (
                detalles.map((d, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">{d.nombre_producto}</td>
                    <td className="p-3 text-center">{d.cantidad}</td>
                    <td className="p-3 text-right">${d.precio_unitario}</td>
                    <td className="p-3 text-right font-bold text-emerald-600">${d.subtotal}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="p-6 text-center text-gray-500">No hay detalles disponibles.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-between items-center shrink-0">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${pedido.estado === 'Completado' ? 'bg-green-100 text-green-700' : pedido.estado === 'Cancelado' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {pedido.estado}
          </span>
          <div className="text-xl font-bold text-gray-800">
            Total: <span className="text-orange-500">${pedido.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CRUD GENERICO---
function CRUDModal({ title, icon: Icon, endpoint, onClose, fields, onViewDetails, customAction }) {
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
  const estadosReserva = ['Pendiente', 'Confirmada', 'Cancelada', 'Completada'];
  const categoriasProducto = ['Hamburguesas', 'Pizzas', 'Bebidas', 'Postres', 'Entradas', 'Salsas', 'Ensaladas'];
  const estadosProducto = ['Activo', 'Inactivo'];

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/${endpoint}`);
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
  const getIdField = (item) => item[getIdKey()];

  const filteredItems = items.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleCreate = () => {
    if (customAction) {
      customAction();
      return;
    }
    setCurrentItem(null);
    const initialData = {};
    fields.forEach(field => initialData[field] = '');
    if (endpoint === 'usuarios') initialData['contraseña'] = '';
    if (title === 'Productos') initialData['estado'] = 'Activo';
    setFormData(initialData);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    const editData = {};
    fields.forEach(field => {
      let value = item[field] || '';
      if (field.includes('fecha') || field.includes('hora')) value = formatDateTimeLocal(value);
      editData[field] = value;
    });
    if (endpoint === 'usuarios') editData['contraseña'] = '';
    setFormData(editData);
    setShowModal(true);
  };

  const handleSave = async () => {
    const isUpdating = !!currentItem;
    const idKey = getIdKey();
    const idValue = currentItem ? currentItem[idKey] : null;
    const url = isUpdating ?(`${API_URL}/${endpoint}/${idValue}`) : (`${API_URL}/${endpoint}`);
    const method = isUpdating ? 'PUT' : 'POST';
    let dataToSend = { ...formData };
    if (!isUpdating) delete dataToSend[idKey];
    if (isUpdating && endpoint === 'usuarios' && dataToSend.contraseña === '') delete dataToSend.contraseña;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || errData.message || 'Error al guardar');
      }
      setShowModal(false);
      fetchItems();
      try { if (endpoint === 'pedidos') window.dispatchEvent(new Event('dashboard:refresh')); } catch (e) { }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDelete = (item) => {
    setCurrentItem(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!currentItem) return;
    const idValue = currentItem[getIdKey()];
    try {
      const response = await fetch(`${API_URL}/${endpoint}/${idValue}`, { method: 'DELETE' });
      
      if (!response.ok) { 
          const data = await response.json().catch(() => ({})); 
          throw new Error(data.message || 'Error al eliminar');
      }
      
      setShowDeleteModal(false);
      fetchItems(); 
      try { if (endpoint === 'pedidos') window.dispatchEvent(new Event('dashboard:refresh')); } catch (e) { }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const formatLabel = (field) => field.replace(/_/g, ' ').charAt(0).toUpperCase() + field.replace(/_/g, ' ').slice(1);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 md:pl-48">
        <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col md:ml-4">  
          <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Icon className="w-8 h-8 text-orange-500" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Gestión de {title}</h2>
                <p className="text-gray-600 text-sm">Administra {title.toLowerCase()} del sistema</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" placeholder={`Buscar ${title.toLowerCase()}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" />
              </div>
              <button onClick={handleCreate} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> Nuevo
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                      {fields.map(field => <th key={field} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">{formatLabel(field)}</th>)}
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {isLoading ? <tr><td colSpan={fields.length + 2} className="text-center py-12 text-gray-500">Cargando...</td></tr> :
                      filteredItems.length > 0 ? filteredItems.map((item) => {
                        const idValue = getIdField(item);
                        return (
                          <tr key={idValue} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{idValue}</td>
                            {fields.map(field => {
                              const val = item[field];
                              const display = (field.includes('fecha') && val) ? new Date(val).toLocaleString() : val;
                              return <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{display}</td>
                            })}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {onViewDetails && (
                                <button onClick={() => onViewDetails(item)} className="text-emerald-600 hover:text-emerald-900 mr-4 inline-flex items-center gap-1">
                                  <FileText className="w-4 h-4" /> Detalle
                                </button>
                              )}
                              <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center gap-1"><Edit2 className="w-4 h-4" />Editar</button>
                              <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"><Trash2 className="w-4 h-4" />Eliminar</button>
                            </td>
                          </tr>
                        );
                      }) : <tr><td colSpan={fields.length + 2} className="text-center py-12"><p className="text-gray-500">No se encontraron datos</p></td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">{currentItem ? `Editar ${title}` : `Nuevo ${title}`}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
            </div>

            <div className="p-6 space-y-4">
              {fields.map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{formatLabel(field)}</label>

                  {(title === "Usuarios" && field === "rol") ||
                    (title === "Mesas" && field === "estado") ||
                    (title === "Pedidos" && field === "estado") ||
                    (title === "Reservas" && field === "estado") ||
                    (title === "Productos" && (field === "categoria" || field === "estado")) ? (
                    <select
                      name={field}
                      value={formData[field] || ''}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    >
                      <option value="" disabled>Seleccione...</option>
                      {(title === "Usuarios" && field === "rol" ? rolesPermitidos :
                        title === "Mesas" ? estadosMesa :
                          title === "Reservas" ? estadosReserva :
                            title === "Productos" && field === "categoria" ? categoriasProducto :
                              title === "Productos" && field === "estado" ? estadosProducto :
                                estadosPedido
                      ).map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : field.includes('fecha') ? (
                    <input
                      type="datetime-local"
                      name={field}
                      value={formData[field] || ''}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  ) : (
                    <input
                      type={field.includes('email') ? 'email' : field.includes('contraseña') ? 'password' : 'text'}
                      name={field}
                      value={formData[field] || ''}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      required={!currentItem || field !== 'contraseña'}
                    />
                  )}
                </div>
              ))}

              {title === "Usuarios" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña {currentItem ? '(Opcional: Dejar vacío para no cambiar)' : '*'}
                  </label>
                  <input
                    type='password'
                    name='contraseña'
                    value={formData['contraseña'] || ''}
                    onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
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
              <button onClick={handleSave} className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                Guardar
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



function ProductCRUDModal({ onClose }) {
  return <CRUDModal title="Productos" icon={Package} endpoint="productos" onClose={onClose} fields={['nombre', 'categoria', 'precio', 'stock', 'estado']} />;
}

function OrderCRUDModal({ onClose }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  if (isCreating) {
    return (
      <NewOrderModal
        onClose={() => setIsCreating(false)}
        onSaveSuccess={() => setIsCreating(false)}
      />
    );
  }

  return (
    <>
      <CRUDModal
        title="Pedidos"
        icon={FileText}
        endpoint="pedidos"
        onClose={onClose}
        fields={['nombre_cliente', 'nombre_empleado', 'fecha_hora', 'total', 'estado']}
        onViewDetails={(item) => setSelectedOrder(item)}
        customAction={() => setIsCreating(true)}
      />
      {selectedOrder && <OrderDetailsModal pedido={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </>
  );
}

function ReservaCRUDModal({ onClose }) {
  const [isCreating, setIsCreating] = useState(false);

  if (isCreating) {
    return (
      <NewReservaModal
        onClose={() => setIsCreating(false)}
        onSaveSuccess={() => setIsCreating(false)}
      />
    );
  }

  return (
    <CRUDModal
      title="Reservas"
      icon={Bookmark}
      endpoint="reservas"
      onClose={onClose}
      fields={['nombre_cliente', 'numero_mesa', 'fecha_hora', 'estado']}
      customAction={() => setIsCreating(true)}
    />
  );
}

function ClienteCRUDModal({ onClose }) {
  const [isCreating, setIsCreating] = useState(false);

  if (isCreating) {
    return (
      <NewClienteModal
        onClose={() => setIsCreating(false)}
        onSaveSuccess={() => setIsCreating(false)}
      />
    );
  }

  return (
    <CRUDModal
      title="Clientes"
      icon={Users}
      endpoint="clientes"
      onClose={onClose}
      fields={['nombre_usuario', 'email_usuario', 'telefono', 'direccion']}
      customAction={() => setIsCreating(true)}
    />
  );
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
  const [isCreating, setIsCreating] = useState(false);

  if (isCreating) {
    return (
      <NewEmpleadoModal
        onClose={() => setIsCreating(false)}
        onSaveSuccess={() => setIsCreating(false)}
      />
    );
  }

  return (
    <CRUDModal
      title="Empleados"
      icon={Users}
      endpoint="empleados"
      onClose={onClose}
      fields={['nombre_empleado', 'puesto', 'salario']}
      customAction={() => setIsCreating(true)}
    />
  );
}



function App() {
  const { obtenerPrediccionSemanal, entrenarModelo, loading: aiLoading } = usePredictions();
  const [rawAiData, setRawAiData] = useState([]);
  const [aiFilter, setAiFilter] = useState('hours');
  const [aiError, setAiError] = useState(null);
  const [modelNeedsTraining, setModelNeedsTraining] = useState(false);
  const RESTAURANTE_ID = 1;

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [usuario] = useState({ nombre: 'Admin' });

  const [showProductCRUD, setShowProductCRUD] = useState(false);
  const [showOrderCRUD, setShowOrderCRUD] = useState(false);
  const [showReservaCRUD, setShowReservaCRUD] = useState(false);
  const [showClienteCRUD, setShowClienteCRUD] = useState(false);
  const [showReporteCRUD, setShowReporteCRUD] = useState(false);
  const [showMesaCRUD, setShowMesaCRUD] = useState(false);
  const [showUsuarioCRUD, setShowUsuarioCRUD] = useState(false);
  const [showEmpleadoCRUD, setShowEmpleadoCRUD] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [estadisticas, setEstadisticas] = useState({
    pedidosDelDia: 0,
    ingresosHoy: 0,
    clientesActivos: 0,
    reservasProximas: 0
  });
  const [dailySalesData, setDailySalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [proximasReservas, setProximasReservas] = useState([]);
  const [ultimosMovimientos, setUltimosMovimientos] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [mesasEnLimpieza, setMesasEnLimpieza] = useState([]);

  const loadPredictions = useCallback(async () => {
    try {
      setAiError(null);
      const response = await obtenerPrediccionSemanal(RESTAURANTE_ID);
      const predicciones = response.predicciones || response.data?.predicciones;
      if (predicciones && predicciones.length > 0) {
        setRawAiData(predicciones);
        setModelNeedsTraining(false);
      } else {
        setRawAiData([]);
      }
    } catch (error) {
      if (error.message && (error.message.includes("404") || error.message.includes("Modelo no encontrado"))) {
        setModelNeedsTraining(true);
      } else {
        setAiError("Error de conexión con IA");
      }
    }
  }, [obtenerPrediccionSemanal]);

  const chartData = useMemo(() => {
    if (!rawAiData || rawAiData.length === 0) return [];
    if (aiFilter === 'hours') {
      return rawAiData.slice(0, 24).map(p => ({ label: `${String(p.hora).padStart(2, '0')}:00`, value: Math.round(Number(p.demanda_predicha)) }));
    }
    if (aiFilter === 'days') {
      const daysMap = {};
      rawAiData.forEach(p => {
        const date = new Date(p.fecha);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() + userTimezoneOffset);
        const key = `${localDate.toLocaleDateString('es-ES', { weekday: 'short' })} ${localDate.getDate()}`;
        if (!daysMap[key]) daysMap[key] = 0;
        daysMap[key] += Number(p.demanda_predicha);
      });
      return Object.keys(daysMap).map(key => ({ label: key.charAt(0).toUpperCase() + key.slice(1), value: Math.round(daysMap[key]) })).slice(0, 7);
    }
    if (aiFilter === 'monthly') {
      const monthlyData = [];
      const currentData = rawAiData.slice(0, 168);
      const dailyTotals = {};
      currentData.forEach(p => {
        const d = new Date(p.fecha);
        const userTimezoneOffset = d.getTimezoneOffset() * 60000;
        const localDate = new Date(d.getTime() + userTimezoneOffset);
        const day = localDate.getDay();
        if (!dailyTotals[day]) dailyTotals[day] = 0;
        dailyTotals[day] += Number(p.demanda_predicha);
      });
      const startDate = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const { season, type } = getSeasonAndType(date);
        let val = dailyTotals[date.getDay()] || 0;
        if (type === 'Alta') val *= 1.2;
        if (type === 'Baja') val *= 0.9;
        val = Math.round(val * (0.9 + Math.random() * 0.2));
        monthlyData.push({ label: `${date.getDate()}/${date.getMonth() + 1}`, value: val, season, type });
      }
      return monthlyData;
    }
    return [];
  }, [rawAiData, aiFilter]);

  const aiInsights = useMemo(() => {
    if (!chartData || chartData.length === 0) return null;
    const maxPoint = chartData.reduce((max, p) => p.value > max.value ? p : max, chartData[0]);
    const totalExpected = chartData.reduce((sum, p) => sum + p.value, 0);
    return {
      title: aiFilter === 'monthly' ? 'Tendencia Mensual' : 'Proyección Corto Plazo',
      items: [
        { icon: <Activity size={14} />, text: `Pico probable: ${maxPoint.label}` },
        { icon: <TrendingUp size={14} />, text: `Estimado total: ~${totalExpected} pedidos` }
      ]
    };
  }, [chartData, aiFilter]);

  const handleTrainModel = async () => {
    try {
      await entrenarModelo(RESTAURANTE_ID);
      alert("Modelo entrenado.");
      loadPredictions();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  useEffect(() => { loadPredictions(); }, [loadPredictions]);

  const handleLogout = () => { window.location.href = '/'; };

  const cargarDatosDashboard = useCallback(async () => {
    try {
      const resEstadisticas = await fetch(`${API_URL}/dashboard/estadisticas`);
      if (resEstadisticas.ok) setEstadisticas(await resEstadisticas.json());

      const resVentas = await fetch(`${API_URL}/dashboard/ventas-diarias`);
      if (resVentas.ok) setDailySalesData(await resVentas.json());

      const resCategorias = await fetch(`${API_URL}/dashboard/categorias-mas-vendidas`);
      if (resCategorias.ok) setCategoryData(await resCategorias.json());

      const resReservas = await fetch(`${API_URL}/dashboard/proximas-reservas`);
      if (resReservas.ok) setProximasReservas(await resReservas.json());

      const resProductos = await fetch(`${API_URL}/dashboard/productos-mas-vendidos`);
      if (resProductos.ok) setProductosMasVendidos(await resProductos.json());

      try {
        const [resAllProductos, resMesas] = await Promise.all([
          fetch(`${API_URL}/productos`),
          fetch(`${API_URL}/mesas`)
        ]);
        if (resAllProductos.ok) {
          const allProds = await resAllProductos.json();
          setLowStockProducts(allProds.filter(p => (parseInt(p.stock) || 0) > 0 && (parseInt(p.stock) || 0) <= 5));
        }
        if (resMesas.ok) {
          const allMesas = await resMesas.json();
          setMesasEnLimpieza(allMesas.filter(m => m.estado && String(m.estado).toLowerCase().includes('limpieza')));
        }
      } catch (e) {}

      const resMovimientos = await fetch(`${API_URL}/dashboard/ultimos-movimientos`);
      if (resMovimientos.ok) setUltimosMovimientos(await resMovimientos.json());

    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    }
  }, []);

  useEffect(() => {
    cargarDatosDashboard();
    const interval = setInterval(cargarDatosDashboard, 30000);
    return () => clearInterval(interval);
  }, [cargarDatosDashboard]);

  useEffect(() => {
    const handler = () => cargarDatosDashboard();
    window.addEventListener('dashboard:refresh', handler);
    return () => window.removeEventListener('dashboard:refresh', handler);
  }, [cargarDatosDashboard]);


  const defaultDailySalesData = [
    { day: 'L', sales: 220 }, { day: 'M', sales: 280 }, { day: 'M', sales: 250 },
    { day: 'J', sales: 240 }, { day: 'S', sales: 270 }, { day: 'S', sales: 310 }
  ];
  const defaultCategoryData = [
    { name: 'Hamburguesas', value: 35, color: '#EF4444' }, { name: 'Pizza', value: 25, color: '#F97316' },
    { name: 'Sushi', value: 20, color: '#10B981' }, { name: 'Ensaladas', value: 20, color: '#14B8A6' }
  ];

return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* SIDEBAR */}
      <div className={`
          bg-gray-900 text-white p-4 flex-col transition-all duration-300
          ${mobileMenuOpen ? 'fixed inset-y-0 left-0 z-50 w-64 flex shadow-2xl' : 'hidden md:flex w-48'}
          h-full
      `}>
        <div className="flex items-center justify-between mb-8">
          <div className="text-orange-500 text-2xl font-bold">ClickFood</div>
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto">
          <button onClick={() => { setShowOrderCRUD(true); setMobileMenuOpen(false); }} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"><FileText size={20} className="text-emerald-400" /><span className="text-sm">Gestión de pedidos</span></button>
          <button onClick={() => { setShowProductCRUD(true); setMobileMenuOpen(false); }} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"><Package size={20} className="text-emerald-400" /><span className="text-sm">Gestión de productos</span></button>
          <button onClick={() => { setShowReservaCRUD(true); setMobileMenuOpen(false); }} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"><Bookmark size={20} className="text-emerald-400" /><span className="text-sm">Gestión de reservas</span></button>
          <button onClick={() => { setShowClienteCRUD(true); setMobileMenuOpen(false); }} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"><Users size={20} className="text-emerald-400" /><span className="text-sm">Gestión de clientes</span></button>
          <button onClick={() => { setShowMesaCRUD(true); setMobileMenuOpen(false); }} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"><CreditCard size={20} className="text-emerald-400" /><span className="text-sm">Gestión de mesas</span></button>
          <button onClick={() => { setShowUsuarioCRUD(true); setMobileMenuOpen(false); }} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"><Users size={20} className="text-emerald-400" /><span className="text-sm">Gestión de usuarios</span></button>
          <button onClick={() => { setShowEmpleadoCRUD(true); setMobileMenuOpen(false); }} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"><Users size={20} className="text-emerald-400" /><span className="text-sm">Gestión de empleados</span></button>
        </nav>
        <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-600 bg-red-500 transition-colors text-left mt-4 shrink-0"><LogOut size={20} /><span className="text-sm font-medium">Cerrar sesión</span></button>
      </div>

      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 overflow-auto flex flex-col h-screen">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)} 
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-800 truncate">
              Bienvenido, {usuario.nombre}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <button onClick={() => setShowLogoutConfirm(true)} className="text-gray-600 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-gray-100 hidden md:block"><LogOut size={20} /></button>
          </div>
        </header>

        <div className="p-4 md:p-6 overflow-y-auto">
          {/* Tarjetas Superiores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2"><FileText size={24} /><div className="text-sm opacity-90">Pedidos del día</div></div>
              <div className="text-3xl md:text-4xl font-bold">{estadisticas.pedidosDelDia}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2"><DollarSign size={24} /><div className="text-sm opacity-90">Ingresos hoy</div></div>
              <div className="text-3xl md:text-4xl font-bold">${estadisticas.ingresosHoy.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
            </div>
            <div className="bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2"><Users size={24} /><div className="text-sm opacity-90">Clientes activos</div></div>
              <div className="text-3xl md:text-4xl font-bold">{estadisticas.clientesActivos}</div>
            </div>
            <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2"><CreditCard size={24} /><div className="text-sm opacity-90">Reservas próximas</div></div>
              <div className="text-3xl md:text-4xl font-bold">{estadisticas.reservasProximas}</div>
            </div>
          </div>

          {/* Alertas */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Alertas / Notificaciones</h3>
            <div className="space-y-3">
              {mesasEnLimpieza.length > 0 && (
                <div className="p-3 rounded border border-yellow-100 bg-yellow-50">
                  <div className="text-sm font-semibold text-yellow-800 mb-2">Mesas en limpieza</div>
                  <ul className="text-sm text-yellow-700">
                    {mesasEnLimpieza.map((m, i) => (
                      <li key={i}>Mesa {m.numero} - {m.estado}</li>
                    ))}
                  </ul>
                </div>
              )}

              {lowStockProducts.length > 0 && (
                <div className="p-3 rounded border border-red-100 bg-red-50">
                  <div className="text-sm font-semibold text-red-800 mb-2">Productos con stock bajo</div>
                  <ul className="text-sm text-red-700">
                    {lowStockProducts.map((p, i) => (
                      <li key={i}>{p.nombre} — {p.stock} unidades restantes</li>
                    ))}
                  </ul>
                </div>
              )}

              {mesasEnLimpieza.length === 0 && lowStockProducts.length === 0 && (
                <div className="text-sm text-gray-500">No hay alertas en este momento</div>
              )}
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Ventas diarias</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dailySalesData.length > 0 ? dailySalesData : defaultDailySalesData} margin={{ top: 20 }}>
                  <Bar dataKey="sales" fill="#10B981" radius={[8, 8, 0, 0]} label={{ position: 'top', fill: '#666', fontSize: 12 }} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <Tooltip />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Categorías más vendidas</h3>
              <div className="flex items-center justify-center" style={{ width: '100%' }}>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <Pie
                      data={categoryData.length > 0 ? categoryData : defaultCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      labelLine={true}
                    >
                      {(categoryData.length > 0 ? categoryData : defaultCategoryData).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráfico IA */}
            <div className="bg-white rounded-xl p-6 shadow-sm relative overflow-hidden min-h-[420px]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="text-emerald-500" size={20} />
                  <h3 className="text-lg font-semibold text-gray-800">{aiInsights ? aiInsights.title : 'Predicción de Demanda'}</h3>
                </div>
                {!modelNeedsTraining && !aiError && rawAiData.length > 0 && (
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => setAiFilter('hours')} className={`px-2 py-1 text-xs font-medium rounded-md ${aiFilter === 'hours' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'}`}><Clock size={14} /></button>
                    <button onClick={() => setAiFilter('days')} className={`px-2 py-1 text-xs font-medium rounded-md ${aiFilter === 'days' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'}`}><Calendar size={14} /></button>
                    <button onClick={() => setAiFilter('monthly')} className={`px-2 py-1 text-xs font-medium rounded-md ${aiFilter === 'monthly' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'}`}><TrendingUp size={14} /></button>
                  </div>
                )}
              </div>
              <div className="relative h-[220px] w-full">
                {aiLoading && <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center"><div className="flex items-center gap-2 text-sm text-emerald-600 font-medium"><RefreshCw className="animate-spin" size={18} /> Calculando...</div></div>}
                {modelNeedsTraining ? (
                  <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 text-sm mb-3">El modelo necesita entrenamiento</p>
                    <button onClick={handleTrainModel} disabled={aiLoading} className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-sm"><BrainCircuit size={16} />{aiLoading ? 'Entrenando...' : 'Entrenar Modelo'}</button>
                  </div>
                ) : aiError ? <div className="h-full flex flex-col items-center justify-center text-red-400 text-sm bg-red-50 rounded-lg"><AlertTriangle size={24} className="mb-2" />{aiError}</div> : (
                  <ResponsiveContainer width="100%" height="100%">
                    {aiFilter === 'days' ? (
                      <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="label" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} name="Pedidos esperados" />
                      </BarChart>
                    ) : (
                      <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                          <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="label" fontSize={10} axisLine={false} tickLine={false} interval={aiFilter === 'monthly' ? 6 : 'preserveStartEnd'} />
                        <YAxis fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} fill="url(#demandGradient)" animationDuration={1500} />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
            
            {/* PRÓXIMAS RESERVAS */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-orange-500"/> Próximas Reservas
              </h3>
              <div className="space-y-4">
                {proximasReservas.length > 0 ? proximasReservas.map((res, idx) => (
                   <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors">
                     <div>
                       <div className="font-bold text-gray-800 text-sm">{res.nombre_cliente}</div>
                       <div className="text-xs text-gray-500 font-medium bg-white px-2 py-1 rounded border border-gray-200 inline-block mt-1">
                         Mesa {res.numero_mesa}
                       </div>
                     </div>
                     <div className="text-right">
                       <div className="text-sm font-bold text-orange-600">
                         {new Date(res.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </div>
                       <div className="text-xs text-gray-400">
                         {new Date(res.fecha_hora).toLocaleDateString()}
                       </div>
                     </div>
                   </div>
                )) : <div className="text-center text-sm text-gray-400 py-4">Sin reservas pendientes</div>}
              </div>
            </div>

            {/* PRODUCTOS MÁS VENDIDOS*/}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
               <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                 <Package size={20} className="text-emerald-500"/> Top Productos
               </h3>
               <div className="overflow-hidden">
                 <table className="w-full text-sm">
                   <thead className="bg-gray-100 text-gray-500 text-xs uppercase">
                     <tr>
                       <th className="py-2 px-3 text-left rounded-l-md">Producto</th>
                       <th className="py-2 px-3 text-right rounded-r-md">Vendidos</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {productosMasVendidos.length > 0 ? productosMasVendidos.map((prod, idx) => (
                       <tr key={idx} className="hover:bg-gray-50">
                         <td className="py-3 px-3 font-medium text-gray-700">{prod.nombre || prod.nombre_producto || 'Desconocido'}</td>
                         <td className="py-3 px-3 text-right font-bold text-gray-900">{prod.total || prod.total_vendido || prod.cantidad || 0}</td>
                       </tr>
                     )) : (
                       <tr><td colSpan="2" className="text-center py-4 text-gray-400">No hay datos</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>

            {/* ACTIVIDAD RECIENTE*/}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
               <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                 <Clock size={20} className="text-blue-500"/> Actividad Reciente
               </h3>
               <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                   <thead className="bg-gray-100 text-gray-500 text-xs uppercase">
                     <tr>
                       <th className="py-2 px-3 text-left rounded-l-md">Cliente</th>
                       <th className="py-2 px-3 text-right rounded-r-md">Total</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {ultimosMovimientos.map((mov, i) => (
                       <tr key={i} className="hover:bg-gray-50 transition-colors">
                         <td className="py-3 px-3 font-medium text-gray-800">{mov.nombre_cliente}</td>
                         <td className="py-3 px-3 text-right font-bold text-emerald-600">${mov.total}</td>
                       </tr>
                     ))}
                     {ultimosMovimientos.length === 0 && (
                       <tr><td colSpan="2" className="text-center py-4 text-gray-400">Sin movimientos recientes</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>
            </div>

          </div>

        </div>
      </div>

      {/* MODALES */}
      {showProductCRUD && <ProductCRUDModal onClose={() => setShowProductCRUD(false)} />}
      {showOrderCRUD && <OrderCRUDModal onClose={() => setShowOrderCRUD(false)} />}
      {showReservaCRUD && <ReservaCRUDModal onClose={() => setShowReservaCRUD(false)} />}
      {showClienteCRUD && <ClienteCRUDModal onClose={() => setShowClienteCRUD(false)} />}
      {showReporteCRUD && <ReporteCRUDModal onClose={() => setShowReporteCRUD(false)} />}
      {showMesaCRUD && <MesaCRUDModal onClose={() => setShowMesaCRUD(false)} />}
      {showUsuarioCRUD && <UsuarioCRUDModal onClose={() => setShowUsuarioCRUD(false)} />}
      {showEmpleadoCRUD && <EmpleadoCRUDModal onClose={() => setShowEmpleadoCRUD(false)} />}

      {/* Modal Logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[80]">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cerrar sesión</h2>
            <p className="text-gray-600 mb-6">¿Estás seguro de que deseas cerrar sesión?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg">Cancelar</button>
              <button onClick={handleLogout} className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg">Cerrar sesión</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;