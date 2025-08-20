// Global variables
let map, placesService;

// Initialize the map and service after DOM load
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 33.92, lng: -117.22 },
    zoom: 12
  });
  placesService = new google.maps.places.PlacesService(map);

  document.getElementById("search-btn").onclick = handleSearch;
  document.getElementById("loc-btn").onclick = handleGeolocation;

  renderClinicsOnMap(map.getCenter());  // initial load
}

function renderClinicsOnMap(location) {
  const request = {
    location,
    radius: 5000,
    type: ["veterinary_care"]
  };

  placesService.nearbySearch(request, (results, status) => {
    if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
      alert("No nearby veterinary clinics found.");
      return;
    }

    clearMapMarkers();
    const listEl = document.getElementById("clinic-list");
    listEl.innerHTML = "";

    results.forEach(place => {
      const marker = new google.maps.Marker({ map, position: place.geometry.location });
      marker.addListener("click", () => showInfoWindow(place, marker));

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
  });
}

function handleSearch() {
  const loc = document.getElementById("location-input").value.trim();
  if (!loc) return;

  fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=us&q=${encodeURIComponent(loc)}`)
    .then(res => res.json())
    .then(data => {
      if (!data[0]) return alert("Location not found.");

      const pos = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
      map.setCenter(pos);
      renderClinicsOnMap(pos);
    });
}

function handleGeolocation() {
  if (!navigator.geolocation) return alert("Geolocation not supported.");

  navigator.geolocation.getCurrentPosition(
    pos => {
      const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      map.setCenter(userLoc);
      renderClinicsOnMap(userLoc);
    },
    () => alert("Unable to access your location.")
  );
}

function openDirections(lat, lng) {
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
}

function clearMapMarkers() {
  // Add logic to clear existing markers if needed
}

function showInfoWindow(place, marker) {
  new google.maps.InfoWindow({
    content: `<div><strong>${place.name}</strong><br>${place.vicinity}</div>`
  }).open(map, marker);
}
