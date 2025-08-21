let map;
let placesService;
let infoWindow;
let markers = [];

window.initMap = function () {
  const defaultLocation = { lat: 33.92, lng: -117.22 }; // Moreno Valley

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 12
  });

  placesService = new google.maps.places.PlacesService(map);
  infoWindow = new google.maps.InfoWindow();

  document.getElementById("search-btn").addEventListener("click", handleSearch);
  document.getElementById("loc-btn").addEventListener("click", handleGeolocation);

  renderClinicsNearby(defaultLocation);
};

async function renderClinicsNearby(center) {
  clearMarkers();

  const request = {
    location: center,
    radius: 5000,
    type: ["veterinary_care"]
  };

  console.log("Search Request:", request);

  try {
    const results = await nearbySearchAsync(request);
    console.log("✅ Clinics Found:", results);

    const list = document.getElementById("clinic-list");
    list.innerHTML = "";

    results.forEach(place => createMarkerAndCard(place));
  } catch (error) {
    console.error("❌ Nearby Search Failed", {
      status: error.status,
      results: error.results
    });
    alert(`Could not load clinics. API status: ${error.status}`);
  }
}

function nearbySearchAsync(request) {
  return new Promise((resolve, reject) => {
    placesService.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        resolve(results);
      } else {
        reject({ status, results });
      }
    });
  });
}

function createMarkerAndCard(place) {
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
    <button onclick="openDirections(${place.geometry.location.lat()}, ${place.geometry.location.lng()})">
      Get Directions
    </button>
  `;
  document.getElementById("clinic-list").appendChild(card);
}

function handleSearch() {
  const query = document.getElementById("location-input").value.trim();
  if (!query) return alert("Please enter a valid ZIP or city.");

  fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=us&q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (!data || !data[0]) return alert("Location not found.");
      const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      map.setCenter(coords);
      renderClinicsNearby(coords);
    })
    .catch(() => alert("Failed to fetch location. Try again."));
}

function handleGeolocation() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const coords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
      map.setCenter(coords);
      renderClinicsNearby(coords);
    },
    () => alert("Unable to access your location.")
  );
}

function openDirections(lat, lng) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(url, "_blank");
}

function clearMarkers() {
  markers.forEach(m => m.setMap(null));
  markers = [];
}
