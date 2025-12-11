import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, Loader, ClipboardList, Search, Calendar, MapPin } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const API_URL = 'http://localhost:5000'; 

export default function Mesero() {
  // --- ESTADOS ---
  const [ordenActual, setOrdenActual] = useState([]);
  const [mesa, setMesa] = useState('');
  const [idReserva, setIdReserva] = useState('');
  
  // Reserva Info
  const [reservaInfo, setReservaInfo] = useState(null);
  const [buscandoReserva, setBuscandoReserva] = useState(false);

  const [productoSel, setProductoSel] = useState('');
  const [notas, setNotas] = useState('');
  const [enviando, setEnviando] = useState(false);

  // SIN variable 'pedidos' para evitar errores
  
  const [menuCategorizado, setMenuCategorizado] = useState({});
  const [cargandoMenu, setCargandoMenu] = useState(true);
  const [stats, setStats] = useState({ total: 0, cocina: 0, completados: 0 });
  
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario')) || null;
  const notificadosRef = useRef(new Set());
  const isFirstLoad = useRef(true);

  // --- EFECTOS ---
  useEffect(() => {
    console.log("🚀 LÓGICA FINAL ACTIVA - Si ves esto, el código nuevo cargó."); // <--- PRUEBA DE CARGA

    if (!usuario || !usuario.id_empleado) {
        console.warn("Advertencia: No se detecta un ID de empleado en la sesión.");
    }

    fetchProductos();
    fetchPedidos();
    
    // Intervalo de 3 segundos
    const intervalId = setInterval(() => {
        fetchPedidos();
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchProductos = async () => {
    try {
        const res = await fetch(`${API_URL}/productos`); 
        if (res.ok) {
            const data = await res.json();
            const lista = Array.isArray(data) ? data : (data.data || []);
            const agrupados = lista.reduce((acc, prod) => {
                const cat = prod.categoria || 'General';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(prod);
                return acc;
            }, {});
            setMenuCategorizado(agrupados);
        }
    } catch (error) { console.error(error); } finally { setCargandoMenu(false); }
  };

const fetchPedidos = async () => {
    try {
        const res = await fetch(`${API_URL}/pedidos?t=${new Date().getTime()}`, {
            headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (res.ok) {
            const data = await res.json();
            const lista = Array.isArray(data) ? data : [];

            // Notificaciones
            if (isFirstLoad.current) {
                lista.forEach(p => {
                    if ((p.estado || '').toLowerCase() === 'completado') notificadosRef.current.add(p.id_pedido);
                });
                isFirstLoad.current = false;
            }

            lista.forEach(pedido => {
                const idEmpleadoDB = String(pedido.id_empleado);
                const idUsuarioLocal = String(usuario?.id_empleado);
                
                if ((pedido.estado || '').toLowerCase() === 'completado' && 
                    idEmpleadoDB === idUsuarioLocal && 
                    !notificadosRef.current.has(pedido.id_pedido)) {
                    
                    toast.success(`✅ Orden #${pedido.id_pedido} completada`, { duration: 5000, icon: '🍽️' });
                    notificadosRef.current.add(pedido.id_pedido);
                }
            });

            
            const misPedidos = lista.filter(p => String(p.id_empleado) === String(usuario?.id_empleado));

            const esDeHoy = (fechaRaw) => {
                if (!fechaRaw) return false;
                
                const fechaString = fechaRaw.endsWith('Z') ? fechaRaw : fechaRaw + 'Z';
                
                const fechaP = new Date(fechaString);
                const hoy = new Date();
                
                return fechaP.getDate() === hoy.getDate() &&
                       fechaP.getMonth() === hoy.getMonth() &&
                       fechaP.getFullYear() === hoy.getFullYear();
            };

            setStats({
                total: misPedidos.filter(p => esDeHoy(p.fecha_hora || p.created_at)).length,

                cocina: misPedidos.filter(p => {
                    const est = (p.estado || '').toLowerCase().trim();
                    return esDeHoy(p.fecha_hora || p.created_at) && 
                           ['pendiente', 'cocinando', 'en proceso', 'recibido'].includes(est);
                }).length,

                completados: misPedidos.filter(p => {
                    const est = (p.estado || '').toLowerCase().trim();
                    return esDeHoy(p.fecha_hora || p.created_at) && est === 'completado';
                }).length
            });
        }
    } catch (err) { console.error("Error fetching pedidos:", err); }
  };
  
  // --- BUSCAR RESERVA ---
  const buscarReserva = async () => {
    if (!idReserva) return;
    setBuscandoReserva(true);
    setReservaInfo(null); 
    setMesa(''); 
    try {
        const res = await fetch(`${API_URL}/reservas/${idReserva}`);
        const data = await res.json();
        if (res.ok) {
            if (data.estado && data.estado.toUpperCase() === 'CANCELADA') {
                alert("ERROR: Esta reserva está CANCELADA.");
                return; 
            }
            setReservaInfo(data);
            if (data.id_mesa) setMesa(data.mesas ? data.mesas.numero : data.id_mesa);
        } else { alert("Reserva no encontrada"); }
    } catch (error) { console.error(error); alert("Error conexión"); } finally { setBuscandoReserva(false); }
  };

  const calcularTotal = () => ordenActual.reduce((t, i) => t + parseFloat(i.precio), 0);

  const agregarProducto = () => {
    if(!productoSel) return;
    let encontrado = null;
    Object.values(menuCategorizado).forEach(lista => {
        const prod = lista.find(p => (p.id_producto || p.id).toString() === productoSel);
        if(prod) encontrado = prod;
    });
    if(encontrado) {
        setOrdenActual([...ordenActual, encontrado]);
        setProductoSel(''); 
    }
  };

  const eliminarItem = (index) => {
      const nueva = [...ordenActual];
      nueva.splice(index, 1);
      setOrdenActual(nueva);
  };

  const enviarOrden = async () => {
    if (!mesa) return alert("⚠️ Falta Mesa");
    if (ordenActual.length === 0) return alert("⚠️ Orden vacía");
    if (!usuario || !usuario.id_empleado) return alert("ERROR: Sin usuario.");

    setEnviando(true);
    const body = {
        id_empleado: usuario.id_empleado, 
        id_mesa: parseInt(mesa),
        id_cliente: reservaInfo ? reservaInfo.id_cliente : null,
        id_reserva: idReserva ? parseInt(idReserva) : null,
        total: calcularTotal(),
        notas: notas,
        productos: ordenActual.map(item => ({
            id_producto: item.id_producto || item.id,
            cantidad: 1, 
            precio: parseFloat(item.precio)
        }))
    };

    try {
        const res = await fetch(`${API_URL}/pedidos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        if (res.ok) {
            toast.success(`✅ Orden enviada a cocina`, { position: 'bottom-center' });
            setOrdenActual([]);
            setMesa('');
            setIdReserva('');
            setReservaInfo(null);
            setNotas('');
            await fetchPedidos();
        } else {
            const err = await res.json();
            alert("Error: " + err.error);
        }
    } catch (error) { alert("Error conexión"); } finally { setEnviando(false); }
  };

  const handleLogout = () => { localStorage.removeItem('usuario'); navigate('/'); };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans pb-10">
       <Toaster />
       <header className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center sticky top-0 z-20 shadow-md">
            <div>
                <h1 className="text-xl font-bold">Panel de Mesero</h1>
                <p className="text-xs text-gray-400">Hola, {usuario?.nombre || 'Mesero'}</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm"><LogOut size={16}/> Salir</button>
       </header>

       <div className="max-w-6xl mx-auto p-6">
           <div className="grid grid-cols-3 gap-6 mb-8">
               <div className="bg-blue-600 rounded-xl p-4 text-center shadow-lg">
                   <div className="text-blue-100 text-xs font-bold uppercase mb-1">Total Hoy</div>
                   <div className="text-3xl font-bold">{stats.total}</div>
               </div>
               <div className="bg-orange-500 rounded-xl p-4 text-center shadow-lg">
                   <div className="text-orange-100 text-xs font-bold uppercase mb-1">En Cocina</div>
                   <div className="text-3xl font-bold">{stats.cocina}</div>
               </div>
               <div className="bg-green-500 rounded-xl p-4 text-center shadow-lg">
                   <div className="text-green-100 text-xs font-bold uppercase mb-1">Completados</div>
                   <div className="text-3xl font-bold">{stats.completados}</div>
               </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="space-y-6">
                   <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                       <h3 className="text-orange-500 font-bold mb-4 flex items-center gap-2"><Calendar size={20}/> Buscar Reserva</h3>
                       <div className="flex gap-2">
                           <input type="number" value={idReserva} onChange={e => setIdReserva(e.target.value)} placeholder="ID Reserva" className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:border-orange-500 outline-none"/>
                           <button onClick={buscarReserva} disabled={buscandoReserva || !idReserva} className="bg-orange-600 hover:bg-orange-500 text-white p-3 rounded-lg disabled:opacity-50">
                               {buscandoReserva ? <Loader className="animate-spin"/> : <Search size={20}/>}
                           </button>
                       </div>
                   </div>

                   {reservaInfo && (
                       <div className="bg-gray-800/50 p-6 rounded-xl border border-blue-500/30 shadow-lg">
                           <h3 className="text-blue-400 font-bold mb-4 text-sm uppercase">Información Cliente</h3>
                           <div className="space-y-3">
                               <div><label className="text-xs text-gray-500 block mb-1">Cliente</label><input disabled value={reservaInfo.nombre_cliente_final || reservaInfo.clientes?.usuarios?.nombre || 'Desconocido'} className="w-full bg-gray-700/50 border border-gray-600 rounded p-2 text-gray-300 font-bold"/></div>
                               <div><label className="text-xs text-gray-500 block mb-1">Fecha</label><input disabled value={new Date(reservaInfo.fecha_hora).toLocaleString()} className="w-full bg-gray-700/50 border border-gray-600 rounded p-2 text-gray-300"/></div>
                           </div>
                       </div>
                   )}

                   <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                       <h3 className="text-white font-bold mb-4 flex items-center gap-2"><MapPin size={20}/> Mesa Asignada</h3>
                       <input type="number" value={mesa} onChange={e => setMesa(e.target.value)} disabled={reservaInfo && reservaInfo.id_mesa} placeholder="Mesa #" className={`w-full bg-gray-900 border border-gray-600 rounded-lg p-4 text-white text-center text-2xl font-bold outline-none focus:border-green-500 ${reservaInfo && reservaInfo.id_mesa ? 'cursor-not-allowed opacity-70' : ''}`}/>
                   </div>
               </div>

               <div className="lg:col-span-2 space-y-6">
                   <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl overflow-hidden">
                       <div className="p-4 border-b border-gray-700 bg-gray-700/20 flex items-center gap-2"><Plus className="text-green-500" size={20}/><h2 className="font-bold text-lg">Tomar Orden</h2></div>
                       <div className="p-6 space-y-6">
                           <div className="flex gap-2">
                                <select value={productoSel} onChange={e => setProductoSel(e.target.value)} className="w-full md:flex-1 bg-gray-900 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-orange-500">
                                    <option value="">{cargandoMenu ? "Cargando..." : "-- Menú --"}</option>
                                    {!cargandoMenu && Object.keys(menuCategorizado).map(cat => (
                                        <optgroup key={cat} label={cat} className="bg-gray-800 text-orange-400 font-bold">
                                            {menuCategorizado[cat].map(prod => (
                                                <option key={prod.id_producto || prod.id} value={prod.id_producto || prod.id} className="text-white font-normal bg-gray-900">{prod.nombre} - ${prod.precio}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                               </select>
                               <button onClick={agregarProducto} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold">Agregar</button>
                           </div>

                           <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
                               <div className="flex justify-between items-end mb-3 border-b border-gray-700 pb-2">
                                   <h4 className="text-xs text-gray-500 uppercase font-bold">Resumen</h4>
                                   <span className="text-lg font-bold text-orange-500">Total: ${calcularTotal().toFixed(2)}</span>
                               </div>
                               {ordenActual.length === 0 ? <div className="text-center py-6 text-gray-500 text-sm italic">Agrega productos...</div> : (
                                   <ul className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                           {ordenActual.map((item, idx) => (
                                               <li key={idx} className="flex justify-between items-center text-sm bg-gray-800 p-3 rounded mb-2">
                                                   <span>{item.nombre}</span>
                                                   <div className="flex items-center gap-3"><span className="text-gray-400">${item.precio}</span><button onClick={() => eliminarItem(idx)} className="text-red-400 hover:text-red-300"><Trash2 size={16}/></button></div>
                                               </li>
                                           ))}
                                   </ul>
                               )}
                           </div>
                           <div><label className="block text-gray-400 text-xs font-bold mb-2 uppercase">Notas Cocina</label><textarea value={notas} onChange={e => setNotas(e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white h-20 resize-none"/></div>
                           <button onClick={enviarOrden} disabled={enviando} className={`w-full font-bold py-4 rounded-lg shadow-lg flex justify-center items-center gap-2 transition-all ${enviando ? 'bg-gray-600' : 'bg-orange-600 hover:bg-orange-500 text-white'}`}>
                               {enviando ? <Loader className="animate-spin"/> : <ClipboardList size={20}/>} {enviando ? "Enviando..." : "Confirmar y Enviar Orden"}
                           </button>
                       </div>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
}