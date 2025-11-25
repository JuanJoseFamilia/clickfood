import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/predictions';

export const usePredictions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Helper para extraer el mensaje de error real del backend
   */
  const getErrorMessage = (err, defaultMsg) => {
    // 1. Intentamos obtener el error específico que manda el backend (ej: "Modelo no encontrado")
    const backendError = err.response?.data?.error;
    // 2. Si no, buscamos el mensaje genérico
    const backendMessage = err.response?.data?.message;
    // 3. Si no, usamos el mensaje por defecto
    return backendError || backendMessage || defaultMsg;
  };

  /**
   * Verifica si el servicio de IA está disponible
   */
  const verificarEstado = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/health`);
      return response.data;
    } catch (err) {
      const errorMsg = getErrorMessage(err, 'Servicio de IA no disponible');
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Entrena el modelo con datos históricos
   */
  const entrenarModelo = useCallback(async (restauranteId, mesesHistorico = 3) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_URL}/train/${restauranteId}`,
        { mesesHistorico }
      );
      return response.data;
    } catch (err) {
      const errorMsg = getErrorMessage(err, 'Error al entrenar modelo');
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene predicción para fecha y hora específica
   */
  const obtenerPrediccion = useCallback(async (restauranteId, fecha, hora) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_URL}/${restauranteId}`,
        { params: { fecha, hora } }
      );
      return response.data;
    } catch (err) {
      const errorMsg = getErrorMessage(err, 'Error al obtener predicción');
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene predicción semanal completa
   */
  const obtenerPrediccionSemanal = useCallback(async (restauranteId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/${restauranteId}/week`);
      return response.data;
    } catch (err) {
      // AQUÍ OCURRE LA MAGIA: Ahora leerá "Modelo no encontrado"
      const errorMsg = getErrorMessage(err, 'Error al obtener predicción semanal');
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene recomendación de stock para próximas 24h
   */
  const obtenerRecomendacionStock = useCallback(async (restauranteId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/${restauranteId}/stock`);
      return response.data;
    } catch (err) {
      const errorMsg = getErrorMessage(err, 'Error al obtener recomendación');
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    verificarEstado,
    entrenarModelo,
    obtenerPrediccion,
    obtenerPrediccionSemanal,
    obtenerRecomendacionStock
  };
};