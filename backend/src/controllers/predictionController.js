import aiPredictionService from '../services/aiPredictionService.js';
import pool from '../config/db.js'; // Usamos la conexión directa a la BD


export const entrenarModelo = async (req, res) => {
  try {
    const { restauranteId } = req.params;
    const { mesesHistorico = 3 } = req.body;

    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - mesesHistorico);


    // CONSULTA SQL: Obtener fecha de pedidos completados
    const query = `
      SELECT fecha_hora as fecha 
      FROM pedidos 
      WHERE estado = 'completado' 
      AND fecha_hora >= $1
    `;
    
    const result = await pool.query(query, [fechaInicio]);
    const pedidosHistoricos = result.rows;

    if (pedidosHistoricos.length < 30) {
      return res.status(400).json({
        success: false,
        message: 'Se necesitan al menos 30 pedidos históricos para entrenar el modelo',
        pedidos_encontrados: pedidosHistoricos.length
      });
    }

    // Convertir formato para la IA
    const datosLimpios = pedidosHistoricos.map(p => ({ fecha: p.fecha }));
    const datosPreparados = aiPredictionService.prepararDatosHistoricos(datosLimpios);

    // Enviar a Python
    const resultado = await aiPredictionService.entrenarModelo(restauranteId, datosPreparados);

    if (resultado.success) {
      res.json({
        success: true,
        message: 'Modelo entrenado exitosamente',
        data: resultado.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error al entrenar modelo en el servicio de IA',
        error: resultado.error
      });
    }

  } catch (error) {
    console.error('Error en entrenarModelo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

export const obtenerPrediccion = async (req, res) => {
  try {
    const { restauranteId } = req.params;
    const { fecha, hora } = req.query;

    if (!fecha || hora === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Faltan parámetros: fecha (YYYY-MM-DD) y hora (0-23)'
      });
    }

    const resultado = await aiPredictionService.predecirDemanda(restauranteId, fecha, parseInt(hora));

    if (resultado.success) {
      res.json({ success: true, data: resultado.data });
    } else {
      res.status(500).json({ success: false, message: 'Error al predecir', error: resultado.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno', error: error.message });
  }
};

export const obtenerPrediccionSemana = async (req, res) => {
  try {
    const { restauranteId } = req.params;
    const resultado = await aiPredictionService.predecirSemana(restauranteId);

    if (resultado.success) {
      const predicciones = resultado.data.predicciones;
      let resumen = {};
      
      if (predicciones && predicciones.length > 0) {
        const demandaTotal = predicciones.reduce((sum, p) => sum + p.demanda_predicha, 0);
        const horaPico = predicciones.reduce((max, p) => p.demanda_predicha > max.demanda_predicha ? p : max, predicciones[0]);
        
        resumen = {
            demanda_total_semana: Math.round(demandaTotal),
            demanda_promedio_dia: Math.round(demandaTotal / 7),
            hora_pico: { fecha: horaPico.fecha, hora: horaPico.hora, demanda: horaPico.demanda_predicha }
        };
      }

      res.json({ success: true, data: { ...resultado.data, resumen } });
    } else {
      res.status(500).json({ success: false, message: 'Error al obtener semana', error: resultado.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno', error: error.message });
  }
};

export const obtenerRecomendacionStock = async (req, res) => {
  try {
    const { restauranteId } = req.params;
    const resultado = await aiPredictionService.obtenerRecomendacionStock(restauranteId);

    if (resultado.success) {
      res.json({ success: true, data: resultado.data });
    } else {
      res.status(500).json({ success: false, message: 'Error stock', error: resultado.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno', error: error.message });
  }
};

export const verificarEstadoIA = async (req, res) => {
  try {
    const health = await aiPredictionService.healthCheck();
    if (health) res.json({ success: true, message: 'IA Online', data: health });
    else res.status(503).json({ success: false, message: 'IA Offline' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};