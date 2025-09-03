let map, infoWindow, markers = [];

window.initApp = async function () {
  const defaultLoc = { lat: 33.92, lng: -117.22 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLoc,
    zoom: 12,
  });
  infoWindow = new google.maps.InfoWindow();

  document.getElementById("search-btn").onclick = handleSearch;
  document.getElementById("loc-btn").onclick = handleGeolocation;

  await renderClinicsNearby(defaultLoc);
};

async function renderClinicsNearby(center) {
  clearMarkers();
  document.getElementById("clinic-list").innerHTML = "";

  try {
    const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary('places');

    const request = {
      locationRestriction: {
        circle: {
          center: { latitude: center.lat, longitude: center.lng },
          radius: 5000
        }
      },
      includedTypes: ["veterinary_care"],
      maxResultCount: 10,
      rankPreference: SearchNearbyRankPreference.PROMINENCE
    };

    console.log("Nearby request:", request);
    const response = await Place.searchNearby(request);

    if (!response.places || response.places.length === 0) {
      alert("No clinics found nearby.");
      return;
    }

    response.places.forEach(p => {
      const coords = { lat: p.location.latitude, lng: p.location.longitude };
      const marker = new google.maps.Marker({ position: coords, map, title: p.displayName });
      markers.push(marker);

      marker.addListener("click", () => {
        infoWindow.setContent(`<strong>${p.displayName}</strong><br>${p.formattedAddress || ""}`);
        infoWindow.open(map, marker);
      });

      const card = document.createElement("div");
      card.className = "clinic-card";
      card.innerHTML = `
        <h3>${p.displayName}</h3>
        <p>${p.formattedAddress || "Address not available"}</p>
        <button onclick="openDirections(${coords.lat},${coords.lng})">Get Directions</button>
      `;
      document.getElementById("clinic-list").appendChild(card);
    });

  } catch (err) {
    console.error("Nearby search failed:", err);
    alert("Search for clinics failed—check the console for details.");
  }
}

function openDirections(lat, lng) {
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
}

async function handleSearch() {
  const q = document.getElementById("location-input").value.trim();
  if (!q) return alert("Please enter a city or ZIP.");

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=us&q=${encodeURIComponent(q)}`);
    const data = await res.json();
    const loc = data[0];
    if (!loc) throw new Error("Location not found");

    const coords = { lat: +loc.lat, lng: +loc.lon };
    map.setCenter(coords);
    await renderClinicsNearby(coords);
  } catch (err) {
    console.error("Search error:", err);
    alert("Could not find location.");
  }
}

function handleGeolocation() {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported.");
  }
  navigator.geolocation.getCurrentPosition(
    async pos => {
      const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      map.setCenter(coords);
      await renderClinicsNearby(coords);
    },
    () => alert("Unable to access location.")
  );
}

function clearMarkers() {
  markers.forEach(m => m.setMap(null));
  markers = [];
}
