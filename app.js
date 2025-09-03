let map, infoWindow, markers = [];

async function initApp() {
  const placesLib = await google.maps.importLibrary("places");
  const { Place } = placesLib;

  const defaultLoc = { lat: 33.92, lng: -117.22 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLoc,
    zoom: 12
  });
  infoWindow = new google.maps.InfoWindow();

  document.getElementById("search-btn").onclick = handleSearch;
  document.getElementById("loc-btn").onclick = handleGeolocation;

  await renderClinicsNearby(Place, defaultLoc);
}

window.initMap = initApp;

async function renderClinicsNearby(Place, center) {
  clearMarkers();

  try {
    const { results } = await Place.searchNearby({
      location: center,
      radius: 5000,
      type: "veterinary_care",
      fields: ["name", "geometry", "vicinity"]
    });

    if (!results || !results.length) {
      alert("No clinics found nearby.");
      return;
    }

    const listEl = document.getElementById("clinic-list");
    listEl.innerHTML = "";

    results.forEach(place => {
      const marker = new google.maps.Marker({
        position: place.geometry.location,
        map,
        title: place.name
      });
      markers.push(marker);

      marker.addListener("click", () => {
        infoWindow.setContent(`<strong>${place.name}</strong><br>${place.vicinity}`);
        infoWindow.open(map, marker);
      });

      const card = document.createElement("div");
      card.className = "clinic-card";
      card.innerHTML = `
        <h3>${place.name}</h3>
        <p>${place.vicinity}</p>
        <button onclick="openDirections(${place.geometry.location.lat()},${place.geometry.location.lng()})">
          Get Directions
        </button>
      `;
      listEl.appendChild(card);
    });
  } catch (err) {
    console.error("Error retrieving places:", err);
    alert("Error retrieving clinics—check console.");
  }
}

async function handleSearch() {
  const query = document.getElementById("location-input").value.trim();
  if (!query) return alert("Please enter a city or ZIP.");

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=us&q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (!data[0]) throw new Error("Location not found");

    const coords = { lat: +data[0].lat, lng: +data[0].lon };
    map.setCenter(coords);
    const placesLib = await google.maps.importLibrary("places");
    await renderClinicsNearby(placesLib.Place, coords);
  } catch (err) {
    console.error("Location search error:", err);
    alert("Failed to locate that place.");
  }
}

function handleGeolocation() {
  if (!navigator.geolocation) return alert("Geolocation not supported.");

  navigator.geolocation.getCurrentPosition(async pos => {
    const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    map.setCenter(coords);
    const placesLib = await google.maps.importLibrary("places");
    await renderClinicsNearby(placesLib.Place, coords);
  }, () => alert("Geolocation failed."));
}

function openDirections(lat, lng) {
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
}

function clearMarkers() {
  markers.forEach(m => m.setMap(null));
  markers = [];
}