import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/predictions';

export const usePredictions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const getErrorMessage = (err, defaultMsg) => {
    const backendError = err.response?.data?.error;
    const backendMessage = err.response?.data?.message;
    return backendError || backendMessage || defaultMsg;
  };

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