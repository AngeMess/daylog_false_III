import express from 'express';
const router = express.Router();
import * as aiDataService from '../services/aiDataService.js';

// Endpoint para obtener datos para la IA
router.post('/ai-data', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Se requiere una consulta' });
    }
    
    const data = await aiDataService.getDataForQuery(query);
    res.json(data);
  } catch (error) {
    console.error('Error obteniendo datos para IA:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para procesar consultas y generar respuestas localmente
router.post('/query', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Se requiere una consulta' });
    }
    
    // Obtener datos relevantes
    const data = await aiDataService.getDataForQuery(query);
    
    // Generar respuesta usando la función local
    const response = aiDataService.generateLocalResponse(query, data);
    
    res.json({
      query,
      response,
      data
    });
  } catch (error) {
    console.error('Error procesando consulta:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      response: 'Lo siento, ha ocurrido un error al procesar tu consulta.'
    });
  }
});

export default router;