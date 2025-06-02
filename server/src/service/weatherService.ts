import dotenv from 'dotenv';
import fetch from 'node-fetch';
import dayjs from 'dayjs';
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
const API_KEY = process.env.API_KEY || '';

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// Complete the WeatherService class
class WeatherService {
  // fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const url = `${API_BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=1&appid=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch location data');
    const data = await res.json() as any[];
    if (!Array.isArray(data) || !data.length) throw new Error('Location not found');
    return data[0];
  }

  // destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }

  // buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${API_BASE_URL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}&units=imperial`;
  }

  // fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch weather data');
    return await res.json();
  }

  // parseCurrentWeather method
  private parseCurrentWeather(city: string, data: any): Weather {
    const { dt_txt, weather, main, wind } = data;
    return new Weather(
      city,
      dayjs(dt_txt).format('M/D/YYYY'),
      weather[0].icon,
      weather[0].description,
      Math.round(main.temp),
      Math.round(wind.speed),
      main.humidity
    );
  }

  // buildForecastArray method
  private buildForecastArray(city: string, weatherList: any[]): Weather[] {
    // OpenWeatherMap 5-day forecast is every 3 hours; pick one per day (e.g., 12:00:00)
    const forecast: Weather[] = [];
    const seenDates = new Set();
    for (const entry of weatherList) {
      const date = dayjs(entry.dt_txt).format('M/D/YYYY');
      const hour = dayjs(entry.dt_txt).hour();
      if (!seenDates.has(date) && hour === 12) {
        forecast.push(this.parseCurrentWeather(city, entry));
        seenDates.add(date);
      }
      if (forecast.length === 5) break;
    }
    return forecast;
  }

  // getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> {
    const locationData = await this.fetchLocationData(city);
    const coordinates = this.destructureLocationData(locationData);
    const weatherData = await this.fetchWeatherData(coordinates);

    // First entry is current weather, rest are forecast
    const currentWeather = this.parseCurrentWeather(weatherData.city.name, weatherData.list[0]);
    const forecast = this.buildForecastArray(weatherData.city.name, weatherData.list.slice(1));
    return [currentWeather, ...forecast];
  }
}

export default new WeatherService();
