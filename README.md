# 🐾 PawPath

**PawPath** is a lightweight, mobile-friendly web app for campers and travelers with pets. It helps users find nearby veterinary clinics and emergency animal hospitals by searching a U.S. city or ZIP code or by using the device's current location.

> 🚐 Whether you are off the grid or parked at a scenic campsite, PawPath helps you locate pet care when you need it.

## 🌐 Live Demo

[Open PawPath](https://jeffthomasiii.github.io/pawpath/)

## Features

- Search by U.S. city, state, or ZIP code
- Use browser geolocation to search near the current position
- View veterinary clinics on an interactive Leaflet map
- Filter results between all care, emergency, and routine clinics
- Select a clinic card to center and open its map marker
- Open driving directions without embedding a paid map service
- Responsive desktop, tablet, and mobile layouts
- Keyboard-accessible controls, cards, and map markers

## Technologies

- HTML
- CSS
- JavaScript
- [Leaflet 1.9.4](https://leafletjs.com/) for the interactive map
- [OpenStreetMap](https://www.openstreetmap.org/) map tiles and clinic data
- [Nominatim](https://nominatim.org/) for city and ZIP-code geocoding
- [Overpass API](https://overpass-api.de/) for nearby veterinary-clinic queries

PawPath does not require a Google Maps API key. Google Maps is only used as an external destination for the **Directions** link.

## Project Structure

```text
pawpath/
├── index.html        # Semantic application layout
├── styles.css        # Responsive design system and components
├── app.js            # Leaflet, geocoding, clinic search, filters, and UI state
└── README.md         # Project documentation
```

## Getting Started Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/jeffthomasiii/pawpath.git
   cd pawpath
   ```

2. Serve the folder from a simple local web server. For example, with Python:

   ```bash
   python -m http.server 8000
   ```

3. Open `http://localhost:8000` in a browser.

A local server is recommended because browser geolocation and remote API requests may not work correctly when the page is opened directly from the file system.

## Public API Usage and Fair Use

PawPath currently relies on public OpenStreetMap infrastructure. These services are appropriate for a lightweight proof of concept, but they are not unlimited production APIs.

- Do not bulk download or prefetch OpenStreetMap tiles.
- Avoid rapid or automated repeated searches.
- Preserve OpenStreetMap attribution on the map.
- Clinic data can be incomplete or outdated; users should call ahead when possible.
- Before significant production traffic, configure dedicated geocoding, tile, and place-data providers with appropriate service agreements.

## Privacy

Location information is used in the browser to perform the requested nearby search. PawPath does not currently maintain a backend or store the user's location.

## Roadmap

- [ ] Add configurable map, tile, geocoding, and place-data providers
- [ ] Add a production-ready veterinary data source
- [ ] Add richer emergency-service verification
- [ ] Add clinic hours and open-now status where reliable
- [ ] Add saved clinics and recent searches
- [ ] Add installable progressive-web-app support
- [ ] Add automated accessibility and browser testing

## License

MIT License — free to use, adapt, and share.

## Built By

[Jeff Thomas III](https://github.com/jeffthomasiii)
