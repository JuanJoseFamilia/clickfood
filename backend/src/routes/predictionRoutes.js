import express from 'express';
import { 
  entrenarModelo, 
  obtenerPrediccion, 
  obtenerPrediccionSemana, 
  obtenerRecomendacionStock, 
  verificarEstadoIA 
} from '../controllers/predictionController.js';

const router = express.Router();

router.get('/health', verificarEstadoIA);
router.post('/train/:restauranteId', entrenarModelo);
router.get('/:restauranteId', obtenerPrediccion);
router.get('/:restauranteId/week', obtenerPrediccionSemana);
router.get('/:restauranteId/stock', obtenerRecomendacionStock);

export default router;