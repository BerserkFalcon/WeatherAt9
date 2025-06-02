import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  try {
    const { cityName } = req.body;
    if (!cityName) return res.status(400).json({ error: 'City name required' });

    await HistoryService.addCity(cityName);
    const weatherData = await WeatherService.getWeatherForCity(cityName);

    return res.json(weatherData);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// GET search history
router.get('/history', async (_req, res) => {
  try {
    const cities = await HistoryService.getCities();
    return res.json(cities);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to read search history' });
  }
});

// * BONUS: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    await HistoryService.removeCity(req.params.id);
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete city' });
  }
});

export default router;
