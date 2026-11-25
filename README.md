# Nisse Lindqvist’s portfolio

A React portfolio with a weather lookup powered by [Open-Meteo](https://open-meteo.com/).

## Run locally

Use Node.js 24.

```sh
npm ci
npm start
```

Open the local URL printed by Vite. Run `npm test` for the component tests, or
`npm run build` to write a production build to `build/`. Preview that build
with `npm run preview`.

When hosting the production build, configure the host to serve `index.html`
for client-side routes such as `/weather`.

## Weather API key

The weather demo now uses Open-Meteo’s keyless API for non-commercial use.
The previous OpenWeather key was removed from the app. It remains visible in
older GitHub commits. Revoke it in the OpenWeather dashboard if it is still active.
