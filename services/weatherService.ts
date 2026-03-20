/**
 * OpenWeather API Service (Free Plan)
 * ─────────────────────────────────────
 * Free tier limits:
 *   - Current weather ✓
 *   - 3-hour / 5-day forecast ✓
 *   - 60 calls/min
 *   - NO hourly or daily forecast
 */

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// ── Types ──────────────────────────────────────────────────────────────

export interface CurrentWeather {
  temp: number;           // °C
  feelsLike: number;      // °C
  humidity: number;       // %
  windSpeed: number;      // m/s
  description: string;    // e.g. "heavy rain"
  icon: string;           // OpenWeather icon code
  main: string;           // e.g. "Rain", "Clear", "Clouds"
  visibility: number;     // meters
  pressure: number;       // hPa
  cityName: string;
}

export interface ForecastItem {
  dt: number;             // Unix timestamp
  dateText: string;       // e.g. "2026-03-20 18:00:00"
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  main: string;
  pop: number;            // probability of precipitation 0-1
  rainVolume?: number;    // mm in 3h
}

export interface ForecastData {
  city: string;
  items: ForecastItem[];
}

// ── Risk Assessment ────────────────────────────────────────────────────

export type WeatherRiskLevel = 'low' | 'moderate' | 'high' | 'severe';

export interface WeatherRisk {
  level: WeatherRiskLevel;
  label: string;
  color: string;
  factors: string[];
}

export function assessWeatherRisk(weather: CurrentWeather): WeatherRisk {
  const factors: string[] = [];
  let score = 0;

  // Heavy rain / thunderstorm
  const main = weather.main.toLowerCase();
  if (main === 'thunderstorm') { score += 4; factors.push('Thunderstorm activity'); }
  else if (main === 'rain') { score += 2; factors.push('Rain conditions'); }
  else if (main === 'drizzle') { score += 1; factors.push('Light drizzle'); }

  // High winds
  if (weather.windSpeed > 15) { score += 3; factors.push(`Strong winds (${weather.windSpeed.toFixed(0)} m/s)`); }
  else if (weather.windSpeed > 10) { score += 2; factors.push(`Gusty winds (${weather.windSpeed.toFixed(0)} m/s)`); }
  else if (weather.windSpeed > 6) { score += 1; factors.push('Moderate winds'); }

  // Low visibility
  if (weather.visibility < 500) { score += 3; factors.push('Very low visibility'); }
  else if (weather.visibility < 2000) { score += 2; factors.push('Poor visibility'); }
  else if (weather.visibility < 5000) { score += 1; factors.push('Reduced visibility'); }

  // Extreme temps
  if (weather.temp > 42) { score += 2; factors.push('Extreme heat'); }
  else if (weather.temp > 38) { score += 1; factors.push('High temperature'); }

  if (factors.length === 0) factors.push('Clear conditions');

  if (score >= 5) return { level: 'severe', label: 'Severe Risk', color: '#DC2626', factors };
  if (score >= 3) return { level: 'high', label: 'High Risk', color: '#F97316', factors };
  if (score >= 1) return { level: 'moderate', label: 'Moderate Risk', color: '#F59E0B', factors };
  return { level: 'low', label: 'Low Risk', color: '#10B981', factors };
}

// ── API Calls ──────────────────────────────────────────────────────────

export async function fetchCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
  if (!API_KEY) throw new Error('EXPO_PUBLIC_OPENWEATHER_API not set');

  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenWeather API error ${res.status}: ${body}`);
  }

  const data = await res.json();

  return {
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    main: data.weather[0].main,
    visibility: data.visibility,
    pressure: data.main.pressure,
    cityName: data.name,
  };
}

export async function fetchForecast(lat: number, lon: number): Promise<ForecastData> {
  if (!API_KEY) throw new Error('EXPO_PUBLIC_OPENWEATHER_API not set');

  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenWeather API error ${res.status}: ${body}`);
  }

  const data = await res.json();

  const items: ForecastItem[] = data.list.map((item: any) => ({
    dt: item.dt,
    dateText: item.dt_txt,
    temp: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
    windSpeed: item.wind.speed,
    description: item.weather[0].description,
    icon: item.weather[0].icon,
    main: item.weather[0].main,
    pop: item.pop,
    rainVolume: item.rain?.['3h'],
  }));

  return {
    city: data.city.name,
    items,
  };
}

// ── Helpers ────────────────────────────────────────────────────────────

export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

/** Get forecast items for the next N hours */
export function getUpcomingForecast(forecast: ForecastData, hours: number = 24): ForecastItem[] {
  const now = Date.now() / 1000;
  const cutoff = now + hours * 3600;
  return forecast.items.filter(item => item.dt >= now && item.dt <= cutoff);
}

/** Get tomorrow's forecast items */
export function getTomorrowForecast(forecast: ForecastData): ForecastItem[] {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  return forecast.items.filter(item => item.dateText.startsWith(tomorrowStr));
}
