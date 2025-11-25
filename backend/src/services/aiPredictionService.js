import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class AIPredictionService {
  constructor() {
    this.AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    this.timeout = 10000; 
  }

  async healthCheck() {
    try {
      const response = await axios.get(`${this.AI_SERVICE_URL}/health`, { timeout: this.timeout });
      return response.data;
    } catch (error) {
      return null;
    }
  }

  async entrenarModelo(restauranteId, datosHistoricos) {
    try {
      const response = await axios.post(
        `${this.AI_SERVICE_URL}/api/train`,
        { restaurante_id: restauranteId, datos_historicos: datosHistoricos },
        { timeout: 30000 }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.message };
    }
  }

  async predecirDemanda(restauranteId, fecha, hora) {
    try {
      const response = await axios.post(
        `${this.AI_SERVICE_URL}/api/predict`,
        { restaurante_id: restauranteId, fecha, hora },
        { timeout: this.timeout }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.message };
    }
  }

  async predecirSemana(restauranteId) {
    try {
      const response = await axios.get(
        `${this.AI_SERVICE_URL}/api/predict/week/${restauranteId}`,
        { timeout: this.timeout }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.message };
    }
  }

  async obtenerRecomendacionStock(restauranteId) {
    try {
      const response = await axios.get(
        `${this.AI_SERVICE_URL}/api/stock-recommendation/${restauranteId}`,
        { timeout: this.timeout }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || error.message };
    }
  }

  prepararDatosHistoricos(pedidos) {
    const datosAgrupados = {};
    pedidos.forEach(pedido => {
      const fecha = new Date(pedido.fecha);
      const fechaStr = fecha.toISOString().split('T')[0];
      const hora = fecha.getHours();
      const key = `${fechaStr}-${hora}`;

      if (!datosAgrupados[key]) {
        datosAgrupados[key] = { fecha: fechaStr, hora: hora, pedidos: 0 };
      }
      datosAgrupados[key].pedidos += 1;
    });
    return Object.values(datosAgrupados);
  }
}

export default new AIPredictionService();