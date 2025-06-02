import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HISTORY_PATH = path.resolve(__dirname, '../../db/db.json');

// Define a City class with name and id properties
class City {
  id: string;
  name: string;
  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
  }
}

// Complete the HistoryService class
class HistoryService {
  // read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(HISTORY_PATH, 'utf-8');
      return JSON.parse(data) as City[];
    } catch {
      return [];
    }
  }

  // write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    await fs.writeFile(HISTORY_PATH, JSON.stringify(cities, null, 2));
  }

  // getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cities = await this.read();
    // Prevent duplicates (case-insensitive)
    if (!cities.some(c => c.name.toLowerCase() === city.toLowerCase())) {
      cities.push(new City(city));
      await this.write(cities);
    }
  }

  // * BONUS: removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    let cities = await this.read();
    cities = cities.filter(c => c.id !== id);
    await this.write(cities);
  }
}

export default new HistoryService();
