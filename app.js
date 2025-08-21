let map, infoWindow, markers = [], Place;

window.initMap = async function () {
  // Dynamically load the Places library and get the Place class
  const placesLib = await google.maps.importLibrary('places');
  Place = placesLib.Place;

  const defaultLoc = { lat: 33.92, lng: -117.22 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLoc, zoom: 12
  });
  infoWindow = new google.maps.InfoWindow();

  document.getElementById("search-btn").onclick = handleSearch;
  document.getElementById("loc-btn").onclick = handleGeolocation;

  await renderClinicsNearby(defaultLoc);
};

async function renderClinicsNearby(center) {
  clearMarkers();
  const { results } = await Place.searchNearby({
    location: center,
    radius: 5000,
    type: "veterinary_care",
    fields: ["name", "geometry", "vicinity"]
  }).catch(err => {
    console.error("Search Error:", err);
    alert("Clinic search failed — check console.");
  });

  if (!results || results.length === 0) {
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
      </button>`;
    listEl.appendChild(card);
  });
}

async function handleSearch() {
  const query = document.getElementById("location-input").value.trim();
  if (!query) return alert("Enter a city or ZIP.");

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=us`);
    const data = await res.json();
    if (!data[0]) throw new Error("Location not found");
    const coords = { lat: +data[0].lat, lng: +data[0].lon };
    map.setCenter(coords);
    await renderClinicsNearby(coords);
  } catch (err) {
    console.error("Location error:", err);
    alert("Could not find that location.");
  }
}

function handleGeolocation() {
  if (!navigator.geolocation) return alert("Geolocation not supported.");

  navigator.geolocation.getCurrentPosition(async pos => {
    const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
    map.setCenter(coords);
    await renderClinicsNearby(coords);
  }, () => alert("Geolocation failed."));
}

function openDirections(lat, lng) {
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
}

function clearMarkers() {
  markers.forEach(m => m.setMap(null));
  markers = [];
}
