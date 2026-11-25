import React, { useEffect, useRef, useState } from 'react';

const weatherDescriptions = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Rime fog',
    51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
    56: 'Light freezing drizzle', 57: 'Heavy freezing drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
    66: 'Light freezing rain', 67: 'Heavy freezing rain',
    71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
    80: 'Light rain showers', 81: 'Rain showers', 82: 'Heavy rain showers',
    85: 'Light snow showers', 86: 'Heavy snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with light hail', 99: 'Thunderstorm with heavy hail'
};

const dateFormat = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
});

async function fetchJson(url, params, signal) {
    const response = await fetch(`${url}?${new URLSearchParams(params)}`, { signal });
    if (!response.ok) throw new Error('Weather request failed');
    return response.json();
}

function WeatherApp() {
    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const activeRequest = useRef(null);

    useEffect(() => () => activeRequest.current?.abort(), []);

    async function search(event) {
        event.preventDefault();
        const city = query.trim();
        if (!city) return;

        activeRequest.current?.abort();
        const controller = new AbortController();
        activeRequest.current = controller;
        const { signal } = controller;
        setLoading(true);
        setError('');

        try {
            const locations = await fetchJson('https://geocoding-api.open-meteo.com/v1/search', {
                name: city, count: 1, language: 'en'
            }, signal);
            if (signal.aborted) return;

            const location = locations.results?.[0];
            if (!location) {
                setError(`No city found for “${city}”. Check the spelling and try again.`);
                return;
            }

            const forecast = await fetchJson('https://api.open-meteo.com/v1/forecast', {
                latitude: location.latitude,
                longitude: location.longitude,
                current: 'temperature_2m,weather_code',
                timezone: 'auto'
            }, signal);
            if (signal.aborted) return;

            const current = forecast.current;
            if (!Number.isFinite(current?.temperature_2m) || !Number.isInteger(current.weather_code)) {
                throw new Error('Missing current weather');
            }

            setWeather({
                location: [location.name, location.country].filter(Boolean).join(', '),
                temperature: current.temperature_2m,
                description: weatherDescriptions[current.weather_code] || 'Conditions unavailable',
                date: dateFormat.format(new Date())
            });
        } catch {
            if (!signal.aborted) setError('Could not load weather. Please try again.');
        } finally {
            if (!signal.aborted) setLoading(false);
        }
    }

    return (
        <main className={weather?.temperature > 16 ? 'WeatherApp warm' : 'WeatherApp'}>
            <form className="search-box" onSubmit={search}>
                <label className="sr-only" htmlFor="weather-city">City</label>
                <input
                    id="weather-city"
                    type="search"
                    className="search-bar"
                    autoComplete="off"
                    placeholder="Search for a city"
                    value={query}
                    onChange={event => setQuery(event.target.value)}
                    required
                />
                <button type="submit" className="btn btn-light">Search</button>
            </form>
            <div className="weather-status" role="status">
                {loading ? 'Loading weather…' : error}
            </div>
            {weather && (
                <div className="weather-box" aria-live="polite">
                    <div className="location-box">
                        <div className="location">{weather.location}</div>
                        <div>{weather.date}</div>
                    </div>
                    <div className="temp">{Math.round(weather.temperature)}°C</div>
                    <div className="weather">{weather.description}</div>
                </div>
            )}
            <a className="weather-source" href="https://open-meteo.com/">Weather data by Open-Meteo</a>
        </main>
    );
}

export default WeatherApp;
