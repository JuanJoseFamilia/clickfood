import { API_URL } from '../config';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Loader, LogOut } from 'lucide-react';

const API_URL_PEDIDOS = `${API_URL}/pedidos`;

const Cocina = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

    const usuario = JSON.parse(localStorage.getItem('usuario')) || null;


  useEffect(() => {
    cargarComandas();
    const intervalo = setInterval(() => cargarComandas(false), 5000);
    return () => clearInterval(intervalo);
  }, []);

  const cargarComandas = async (mostrarCarga = true) => {
    if (mostrarCarga) setLoading(true);
    try {
      const res = await fetch(`${API_URL_PEDIDOS}/cocina`);
      if (res.ok) {
        const data = await res.json();
        setPedidos(data);
      }
    } catch (error) { console.error("Error:", error); } 
    finally { if (mostrarCarga) setLoading(false); }
  };

  const marcarCompletado = async (idPedido) => {
    try {
      const res = await fetch(`${API_URL_PEDIDOS}/${idPedido}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Completado' }) 
      });

      if (res.ok) cargarComandas(false);
    } catch (error) { console.error(error); }
  };

  const handleLogout = () => { localStorage.removeItem('usuario'); navigate('/'); };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-6">
      <div className="flex justify-between items-center mb-10 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
           <div className="text-center leading-none">
                <span className="text-3xl font-bold text-white">Click</span>
                <span className="text-3xl font-bold text-orange-500">Food</span>
                <span className="text-3xl ml-2">🍴</span>
           </div>
           <div className="h-10 w-px bg-gray-700 mx-4"></div>
           <h1 className="text-xl text-gray-400 font-medium">Monitor de Cocina</h1>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg border border-gray-700 transition">
          <LogOut size={18} /> Salir
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20"><Loader className="text-orange-500 animate-spin" size={48} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pedidos.length === 0 ? (
            <div className="col-span-full text-center py-20 opacity-50">
                <div className="text-6xl mb-4"></div>
                <h2 className="text-2xl font-bold">Todo limpio, Chef {usuario?.nombre || 'Chef'}.</h2>
            </div>
          ) : (
            pedidos.map((pedido) => (
              <div key={pedido.id_pedido} className={`bg-gray-800 rounded-xl shadow-2xl overflow-hidden border-t-4 flex flex-col ${pedido.estado === 'cocinando' ? 'border-blue-500' : 'border-orange-500'}`}>
                <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-start">
                  <div>
                    <span className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Mesa</span>
                    <span className="text-3xl font-bold text-white">{pedido.mesas?.numero || pedido.id_mesa || '?'}</span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-gray-400 text-sm bg-gray-900 px-2 py-1 rounded">
                        <Clock size={14}/> {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">#{pedido.id_pedido}</span>
                  </div>
                </div>
                
                <div className="p-4 flex-1 overflow-y-auto max-h-80 custom-scrollbar bg-gray-800">
                  {pedido.detalle_pedido && pedido.detalle_pedido.map((d, index) => (
                    <div key={index} className="flex gap-3 py-3 border-b border-gray-700/50 last:border-0 items-start">
                      <span className="bg-gray-700 text-orange-400 font-bold px-2 py-0.5 rounded text-lg min-w-[2rem] text-center">{d.cantidad}</span>
                      <span className="text-gray-200 text-lg font-medium leading-tight">{d.productos ? d.productos.nombre : 'Item'}</span>
                    </div>
                  ))}
                  {pedido.notas && <div className="mt-4 p-3 bg-red-900/20 border border-red-900/50 rounded text-red-200 text-sm italic">{pedido.notas}</div>}
                </div>

                <button
                  onClick={() => marcarCompletado(pedido.id_pedido)}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-5 flex justify-center items-center gap-2 transition-colors text-lg tracking-wide uppercase"
                >
                  <CheckCircle size={24} />
                  MARCAR COMPLETADO
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Cocina;