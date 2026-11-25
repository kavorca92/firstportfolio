import React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import WeatherApp from './WeatherApp';

const city = (name, latitude) => ({
    results: [{ name, country: 'Sweden', latitude, longitude: 18 }]
});
const forecast = temperature => ({
    current: { temperature_2m: temperature, weather_code: 2 }
});
const response = (body, ok = true) => ({ ok, json: async () => body });

function search(name) {
    const input = screen.getByRole('searchbox', { name: 'City' });
    fireEvent.change(input, { target: { value: name } });
    fireEvent.submit(input.form);
    return input;
}

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
});

test('renders weather and preserves the previous result when a search fails', async () => {
    const fetchMock = vi.fn()
        .mockResolvedValueOnce(response(city('Malmö', 55.6)))
        .mockResolvedValueOnce(response(forecast(19)))
        .mockResolvedValueOnce(response({}))
        .mockResolvedValueOnce(response({}, false))
        .mockRejectedValueOnce(new Error('Network error'));
    vi.stubGlobal('fetch', fetchMock);
    render(<WeatherApp />);

    search('  Malmö  ');
    expect(await screen.findByText('Malmö, Sweden')).toBeTruthy();
    expect(screen.getByText('19°C')).toBeTruthy();
    expect(screen.getByRole('main').classList.contains('warm')).toBe(true);
    expect(new URL(fetchMock.mock.calls[0][0]).searchParams.get('name')).toBe('Malmö');

    const input = search('Unknown city');
    expect(await screen.findByText(/No city found/)).toBeTruthy();
    expect(input.value).toBe('Unknown city');
    expect(screen.getByText('Malmö, Sweden')).toBeTruthy();

    search('Stockholm');
    expect(await screen.findByText(/Could not load weather/)).toBeTruthy();
    expect(input.value).toBe('Stockholm');

    search('Uppsala');
    expect(await screen.findByText(/Could not load weather/)).toBeTruthy();
    expect(screen.getByText('Malmö, Sweden')).toBeTruthy();
});

test('an older forecast cannot overwrite the latest search', async () => {
    let finishOlderForecast;
    const olderForecast = new Promise(resolve => { finishOlderForecast = resolve; });
    const fetchMock = vi.fn()
        .mockResolvedValueOnce(response(city('Stockholm', 59.3)))
        .mockReturnValueOnce(olderForecast)
        .mockResolvedValueOnce(response(city('Uppsala', 59.9)))
        .mockResolvedValueOnce(response(forecast(12)));
    vi.stubGlobal('fetch', fetchMock);
    render(<WeatherApp />);

    search('Stockholm');
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(screen.getByRole('status').textContent).toMatch(/Loading weather/);

    search('Uppsala');
    expect(await screen.findByText('Uppsala, Sweden')).toBeTruthy();
    expect(fetchMock.mock.calls[1][1].signal.aborted).toBe(true);
    expect(screen.getByRole('main').classList.contains('warm')).toBe(false);

    await act(async () => { finishOlderForecast(response(forecast(22))); });
    expect(screen.getByText('Uppsala, Sweden')).toBeTruthy();
    expect(screen.queryByText('Stockholm, Sweden')).toBeNull();
});
