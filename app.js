let map;
let infoWindow;
let markers = [];

window.initApp = async function () {
  const defaultCenter = { lat: 33.92, lng: -117.22 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultCenter,
    zoom: 12,
    mapId: "pawpathMap"
  });

  infoWindow = new google.maps.InfoWindow();

  document.getElementById("search-btn").addEventListener("click", handleSearch);
  document.getElementById("loc-btn").addEventListener("click", handleGeolocation);

  await renderClinicsNearby(defaultCenter);
};

async function renderClinicsNearby(center) {
  clearMarkers();
  document.getElementById("clinic-list").innerHTML = "";

  try {
    const { Place } = await google.maps.importLibrary("places");

    const request = {
      locationBias: {
        radius: 5000,
        center: center
      },
      includedTypes: ["veterinary_care"]
    };

    console.log("📍 Search Request:", request);

    const place = new Place({ locationBias: request.locationBias });
    const response = await place.searchNearby(request);

    if (!response.places || response.places.length === 0) {
      alert("No clinics found nearby.");
      return;
    }

    response.places.forEach((p) => {
      const marker = new google.maps.Marker({
        position: p.location,
        map,
        title: p.displayName?.text || "Clinic"
      });

      markers.push(marker);

      marker.addListener("click", () => {
        infoWindow.setContent(`<strong>${p.displayName?.text}</strong><br>${p.formattedAddress || ""}`);
        infoWindow.open(map, marker);
      });

      const card = document.createElement("div");
      card.className = "clinic-card";
      card.innerHTML = `
        <h3>${p.displayName?.text || "Veterinary Clinic"}</h3>
        <p>${p.formattedAddress || "No address available"}</p>
        <button onclick="openDirections(${p.location.lat}, ${p.location.lng})">Get Directions</button>
      `;
      document.getElementById("clinic-list").appendChild(card);
    });

  } catch (err) {
    console.error("🚨 Error during nearby search:", err);
    alert("Failed to load clinics nearby. Please try again.");
  }
}

function openDirections(lat, lng) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(url, "_blank");
}

function handleSearch() {
  const query = document.getElementById("location-input").value.trim();
  if (!query) return alert("Please enter a valid location.");

  fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=us&q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      if (!data[0]) return alert("Location not found.");
      const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      map.setCenter(coords);
      renderClinicsNearby(coords);
    })
    .catch(err => {
      console.error("🌐 Geocoding error:", err);
      alert("Failed to fetch location. Try again.");
    });
}

function handleGeolocation() {
  if (!navigator.geolocation) return alert("Geolocation not supported.");

  navigator.geolocation.getCurrentPosition(
    pos => {
      const coords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
      map.setCenter(coords);
      renderClinicsNearby(coords);
    },
    err => {
      console.error("📍 Geolocation error:", err);
      alert("Unable to retrieve your location.");
    }
  );
}

function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}
