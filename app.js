console.log("🌍 PawPath is loading...");

const clinicsData = {
  routine: [
    { name: "Sunnymead Veterinary Clinic", address: "24588 Sunnymead Blvd, Moreno Valley, CA", phone: "(951) 242‑4056", lat: 33.922, lng: -117.214 },
    { name: "Alessandro Animal Hospital", address: "23932 Alessandro Blvd, Moreno Valley, CA", phone: "(951) 656‑4455", lat: 33.918, lng: -117.242 },
    { name: "Moreno Valley Animal Hospital", address: "23051 Sunnymead Blvd, Moreno Valley, CA", phone: "(951) 242‑2111", lat: 33.905, lng: -117.243 },
    { name: "Moreno Valley Community Vet Care", address: "14041 Elsworth St, Moreno Valley, CA", phone: "(951) 257‑9311", lat: 33.921, lng: -117.234 }
  ],
  emergency: [
    { name: "Animal Emergency Clinic – Inland Empire", address: "22085 Commerce Way, Grand Terrace, CA", phone: "(909) 825‑9350", lat: 34.01, lng: -117.267 }
  ]
};

const map = L.map('map').setView([33.92, -117.22], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

function renderClinics(centerCoords) {
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) map.removeLayer(layer);
  });

  document.getElementById("clinic-list").innerHTML = "";

  const allClinics = clinicsData.routine.concat(clinicsData.emergency);
  allClinics.forEach(c => {
    const marker = L.marker([c.lat, c.lng]).addTo(map).bindPopup(`
      <b>${c.name}</b><br>${c.address}<br>
      <button onclick="openDirections(${c.lat},${c.lng})">Get Directions</button>
    `);

    const card = document.createElement("div");
    card.className = "clinic-card";
    card.innerHTML = `
      <h3>${c.name}</h3>
      <p>${c.address}</p>
      <p>Phone: ${c.phone}</p>
      <button onclick="openDirections(${c.lat},${c.lng})">Get Directions</button>
    `;
    document.getElementById("clinic-list").appendChild(card);
  });

  if (centerCoords) {
    map.setView(centerCoords, 12);
    setTimeout(() => map.invalidateSize(), 200);
  }
}

window.openDirections = (lat, lng) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(url, '_blank');
};

document.getElementById("search-btn").onclick = () => {
  const loc = document.getElementById("location-input").value.trim();
  if (!loc || loc.length < 3) return alert("Please enter a valid city or ZIP.");

  fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=us&q=${encodeURIComponent(loc)}`)
    .then(res => {
      if (!res.ok) throw new Error("Geocoding failed.");
      return res.json();
    })
    .then(data => {
      if (!data[0]) return alert("Location not found.");
      const { lat, lon } = data[0];
      console.log(`📍 Found: ${lat}, ${lon}`);
      renderClinics([lat, lon]);
    })
    .catch(err => {
      console.error("❌ Error:", err);
      alert("Something went wrong fetching the location.");
    });
};

document.getElementById("loc-btn").onclick = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      console.log(`📡 Using current location: ${latitude}, ${longitude}`);
      renderClinics([latitude, longitude]);
    },
    err => {
      console.error("❌ Geolocation error:", err);
      alert("Could not access your location.");
    }
  );
};

// Initial load
renderClinics([33.92, -117.22]);
