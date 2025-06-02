# Weather Dashboard

A full-stack weather dashboard application that allows users to search for current weather and a 5-day forecast for any city, view their search history, and delete previous searches. Built with TypeScript, Express, Vite, and OpenWeatherMap API.

## Features

- Search for a city to view current weather and 5-day forecast
- View and manage search history (add/delete)
- Responsive UI with Bootstrap and custom CSS
- TypeScript on both client and server
- Proxy API requests to avoid CORS issues


## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd weather-dashboard
   ```

2. **Install dependencies for both client and server:**
   ```sh
   npm run install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the `server/` directory:

   ```
   API_BASE_URL=https://api.openweathermap.org
   API_KEY=your_openweathermap_api_key
   ```

### Running the App


Runs both client (Vite) and server (Express) with hot reload:

```sh
npm run start:dev
```

- Client: http://localhost:3000
- Server API: http://localhost:3001

#### Production Build

Build the client and start the server:

```sh
npm start
```

- Visit: http://localhost:3001

## API Endpoints

- `POST /api/weather/` — Get weather data for a city (expects `{ cityName }` in body)
- `GET /api/weather/history` — Get search history
- `DELETE /api/weather/history/:id` — Delete a city from history

## Technologies Used

- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Bootstrap](https://getbootstrap.com/)
