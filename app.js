const DEFAULT_LOCATION = { lat: 33.9425, lng: -117.2297, label: "Moreno Valley, California" };
const SEARCH_RADIUS_METERS = 12000;
const NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/search";
const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter";

const MODE_CONTENT = {
  plan: {
    eyebrow: "Pet-care preparedness for the road",
    title: "Make a pet-care plan before you travel.",
    description:
      "Search a campground, destination, city, or ZIP code. Review nearby veterinary care now so you know where to call and where to go before your trip begins.",
    inputLabel: "Where are you going?",
    placeholder: "Campground, city, state, or ZIP code",
    searchButton: "Explore destination",
    locationButton: "Use current location instead",
    guidance: "Start with where you will stay. PawPath will show care options near that destination.",
    resultsEyebrow: "Trip planning",
    emptySearchMessage: "Enter a campground, destination, city, state, or ZIP code to search.",
    announcement: "Plan a Trip selected. Search a destination to prepare veterinary care options before you leave.",
  },
  now: {
    eyebrow: "When your pet needs care away from home",
    title: "Find nearby pet care now.",
    description:
      "Use your current location to quickly find veterinary and likely emergency care. Review the options, call ahead, and open directions when you are ready to go.",
    inputLabel: "Where should we search?",
    placeholder: "City, state, or ZIP code",
    searchButton: "Search this area",
    locationButton: "Find care near me",
    guidance: "For the fastest nearby search, use your current location. Location access stays in your browser.",
    resultsEyebrow: "Nearby care",
    emptySearchMessage: "Enter a city, state, or ZIP code, or use your current location.",
    announcement: "Find Care Now selected. Use your current location or search an area for nearby veterinary care.",
  },
};

let map;
let markerLayer;
let clinics = [];
let activeFilter = "all";
let activeMode = "plan";
let currentSearchLabel = DEFAULT_LOCATION.label;
let selectedClinicId = null;
const markersById = new Map();

const elements = {};

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
  cacheElements();
  initializeMap();
  bindEvents();
  setMode("plan");
  elements.currentYear.textContent = new Date().getFullYear();
  searchNearby(DEFAULT_LOCATION, DEFAULT_LOCATION.label);
}

function cacheElements() {
  elements.heroPanel = document.getElementById("hero-panel");
  elements.modeButtons = [...document.querySelectorAll("[data-mode]")];
  elements.modeStatus = document.getElementById("mode-status");
  elements.heroEyebrow = document.getElementById("hero-eyebrow");
  elements.pageTitle = document.getElementById("page-title");
  elements.heroDescription = document.getElementById("hero-description");
  elements.locationLabel = document.getElementById("location-label");
  elements.searchForm = document.getElementById("search-form");
  elements.locationInput = document.getElementById("location-input");
  elements.searchButton = document.getElementById("search-btn");
  elements.searchButtonLabel = document.getElementById("search-button-label");
  elements.locationButton = document.getElementById("loc-btn");
  elements.locationButtonLabel = document.getElementById("location-button-label");
  elements.modeGuidance = document.getElementById("mode-guidance");
  elements.formMessage = document.getElementById("form-message");
  elements.clinicList = document.getElementById("clinic-list");
  elements.resultCount = document.getElementById("result-count");
  elements.resultsEyebrow = document.getElementById("results-eyebrow");
  elements.resultsTitle = document.getElementById("results-title");
  elements.emptyTemplate = document.getElementById("empty-state-template");
  elements.filterButtons = [...document.querySelectorAll("[data-filter]")];
  elements.currentYear = document.getElementById("current-year");
}

function initializeMap() {
  map = L.map("map", {
    center: [DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng],
    zoom: 11,
    zoomControl: false,
  });

  L.control.zoom({ position: "topright" }).addTo(map);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  markerLayer = L.layerGroup().addTo(map);
}

function bindEvents() {
  elements.searchForm.addEventListener("submit", handleSearchSubmit);
  elements.locationButton.addEventListener("click", handleGeolocation);

  elements.modeButtons.forEach((button, index) => {
    button.addEventListener("click", () => setMode(button.dataset.mode, true));
    button.addEventListener("keydown", (event) => handleModeKeydown(event, index));
  });

  elements.filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      elements.filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
      renderClinics();
    });
  });
}

function handleModeKeydown(event, currentIndex) {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;

  event.preventDefault();
  let nextIndex = currentIndex;

  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = elements.modeButtons.length - 1;
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    nextIndex = (currentIndex - 1 + elements.modeButtons.length) % elements.modeButtons.length;
  }
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    nextIndex = (currentIndex + 1) % elements.modeButtons.length;
  }

  const nextButton = elements.modeButtons[nextIndex];
  nextButton.focus();
  setMode(nextButton.dataset.mode, true);
}

function setMode(mode, announce = false) {
  if (!MODE_CONTENT[mode]) return;

  activeMode = mode;
  const content = MODE_CONTENT[mode];

  elements.heroPanel.dataset.mode = mode;
  elements.modeButtons.forEach((button) => {
    const isActive = button.dataset.mode === mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  elements.heroEyebrow.textContent = content.eyebrow;
  elements.pageTitle.textContent = content.title;
  elements.heroDescription.textContent = content.description;
  elements.locationLabel.textContent = content.inputLabel;
  elements.locationInput.placeholder = content.placeholder;
  elements.searchButtonLabel.textContent = content.searchButton;
  elements.locationButtonLabel.textContent = content.locationButton;
  elements.modeGuidance.textContent = content.guidance;
  elements.resultsEyebrow.textContent = content.resultsEyebrow;
  updateResultsHeading();
  setMessage("");

  if (announce) {
    elements.modeStatus.textContent = content.announcement;
  }
}

async function handleSearchSubmit(event) {
  event.preventDefault();
  const query = elements.locationInput.value.trim();

  if (!query) {
    setMessage(MODE_CONTENT[activeMode].emptySearchMessage, true);
    elements.locationInput.focus();
    return;
  }

  setLoadingState(`Finding ${query}`);

  try {
    const location = await geocodeLocation(query);
    await searchNearby(location, location.label || query);
  } catch (error) {
    console.error("Location search failed:", error);
    showSearchError(error.message || "We could not find that location. Try a nearby city or ZIP code.");
  }
}

function handleGeolocation() {
  if (!navigator.geolocation) {
    setMessage("This browser does not support location access.", true);
    return;
  }

  setLoadingState("Finding your location");

  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => {
      try {
        await searchNearby(
          { lat: coords.latitude, lng: coords.longitude },
          "your current location"
        );
      } catch (error) {
        console.error("Nearby search failed:", error);
        showSearchError("We found your location but could not load nearby clinics. Please try again.");
      }
    },
    (error) => {
      const message = error.code === error.PERMISSION_DENIED
        ? "Location access was denied. Search by city or ZIP code instead."
        : "Your location is unavailable right now. Search by city or ZIP code instead.";
      showSearchError(message);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
  );
}

async function geocodeLocation(query) {
  const url = new URL(NOMINATIM_ENDPOINT);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("countrycodes", "us");
  url.searchParams.set("limit", "1");
  url.searchParams.set("q", query);

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("The location service is temporarily unavailable.");
  }

  const [result] = await response.json();
  if (!result) {
    throw new Error("We could not find that location. Try including the state or using a ZIP code.");
  }

  return {
    lat: Number(result.lat),
    lng: Number(result.lon),
    label: result.display_name.split(",").slice(0, 3).join(","),
  };
}

async function searchNearby(center, label) {
  setLoadingState(`Finding veterinary care near ${label}`);
  map.setView([center.lat, center.lng], 12);

  try {
    clinics = await fetchVeterinaryClinics(center);
    currentSearchLabel = label || "this area";
    selectedClinicId = null;
    activeFilter = "all";
    resetFilters();
    updateResultsHeading();
    renderClinics();
    setMessage(
      activeMode === "plan"
        ? `Showing care options near ${label}. Review these choices before your trip and call ahead to confirm services.`
        : `Showing veterinary care near ${label}. Call ahead before you travel.`
    );
  } catch (error) {
    console.error("Clinic lookup failed:", error);
    showSearchError("Clinic data is temporarily unavailable. Please try again in a moment.");
  }
}

function updateResultsHeading() {
  if (!elements.resultsTitle) return;
  const label = shortenLabel(currentSearchLabel);
  elements.resultsTitle.textContent = activeMode === "plan"
    ? `Care options near ${label}`
    : `Care near ${label}`;
}

async function fetchVeterinaryClinics(center) {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="veterinary"](around:${SEARCH_RADIUS_METERS},${center.lat},${center.lng});
      way["amenity"="veterinary"](around:${SEARCH_RADIUS_METERS},${center.lat},${center.lng});
      relation["amenity"="veterinary"](around:${SEARCH_RADIUS_METERS},${center.lat},${center.lng});
    );
    out center tags;
  `;

  const response = await fetch(OVERPASS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: new URLSearchParams({ data: query }),
  });

  if (!response.ok) {
    throw new Error(`Overpass request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.elements
    .map((item) => normalizeClinic(item, center))
    .filter(Boolean)
    .sort((a, b) => a.distanceMiles - b.distanceMiles);
}

function normalizeClinic(item, searchCenter) {
  const lat = item.lat ?? item.center?.lat;
  const lng = item.lon ?? item.center?.lon;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const tags = item.tags || {};
  const name = tags.name || tags.operator || "Veterinary clinic";
  const address = formatAddress(tags);
  const phone = tags.phone || tags["contact:phone"] || "";
  const website = normalizeWebsite(tags.website || tags["contact:website"] || "");
  const emergency = isEmergencyClinic(tags, name);

  return {
    id: `${item.type}-${item.id}`,
    name,
    address,
    phone,
    website,
    emergency,
    lat,
    lng,
    distanceMiles: haversineMiles(searchCenter.lat, searchCenter.lng, lat, lng),
  };
}

function formatAddress(tags) {
  const street = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
  const locality = [tags["addr:city"], tags["addr:state"], tags["addr:postcode"]].filter(Boolean).join(", ");
  return [street, locality].filter(Boolean).join(" • ") || "Address not listed in OpenStreetMap";
}

function normalizeWebsite(value) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function isEmergencyClinic(tags, name) {
  const combined = `${name} ${tags.emergency || ""} ${tags.opening_hours || ""}`.toLowerCase();
  return tags.emergency === "yes" || /emergency|24 hour|24-hour|urgent/.test(combined);
}

function renderClinics() {
  markerLayer.clearLayers();
  markersById.clear();
  elements.clinicList.innerHTML = "";

  const visibleClinics = clinics.filter((clinic) => {
    if (activeFilter === "emergency") return clinic.emergency;
    if (activeFilter === "routine") return !clinic.emergency;
    return true;
  });

  elements.resultCount.textContent = `${visibleClinics.length} ${visibleClinics.length === 1 ? "result" : "results"}`;

  if (!visibleClinics.length) {
    elements.clinicList.appendChild(elements.emptyTemplate.content.cloneNode(true));
    return;
  }

  const bounds = [];

  visibleClinics.forEach((clinic) => {
    const marker = createMarker(clinic).addTo(markerLayer);
    markersById.set(clinic.id, marker);
    bounds.push([clinic.lat, clinic.lng]);
    elements.clinicList.appendChild(createClinicCard(clinic));
  });

  if (bounds.length === 1) {
    map.setView(bounds[0], 14);
  } else {
    map.fitBounds(bounds, { padding: [45, 45], maxZoom: 14 });
  }
}

function createMarker(clinic) {
  const icon = L.divIcon({
    className: "",
    html: `<div class="custom-marker${clinic.emergency ? " is-emergency" : ""}"><span aria-hidden="true">✚</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32],
  });

  const marker = L.marker([clinic.lat, clinic.lng], {
    icon,
    title: clinic.name,
    keyboard: true,
  });

  marker.bindPopup(`
    <strong class="popup-title">${escapeHtml(clinic.name)}</strong>
    <span>${escapeHtml(clinic.address)}</span>
  `);

  marker.on("click", () => selectClinic(clinic.id, false));
  return marker;
}

function createClinicCard(clinic) {
  const card = document.createElement("article");
  card.className = "clinic-card";
  card.tabIndex = 0;
  card.dataset.clinicId = clinic.id;
  card.setAttribute("aria-label", `View ${clinic.name} on the map`);

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lng}`;

  card.innerHTML = `
    <div class="clinic-card-header">
      <div>
        <h3>${escapeHtml(clinic.name)}</h3>
        <p>${escapeHtml(clinic.address)}</p>
      </div>
      <span class="care-badge${clinic.emergency ? " is-emergency" : ""}">
        ${clinic.emergency ? "Emergency" : "Veterinary"}
      </span>
    </div>
    <div class="card-meta">
      <span>${clinic.distanceMiles.toFixed(1)} mi away</span>
      ${clinic.phone ? `<span>☎ ${escapeHtml(clinic.phone)}</span>` : ""}
      ${clinic.website ? `<a href="${escapeAttribute(clinic.website)}" target="_blank" rel="noopener noreferrer">Website</a>` : ""}
    </div>
    <div class="card-actions">
      <span>${clinic.emergency ? "Emergency service indicated" : "Call to confirm services"}</span>
      <a class="directions-link" href="${directionsUrl}" target="_blank" rel="noopener noreferrer">Directions ↗</a>
    </div>
  `;

  card.addEventListener("click", (event) => {
    if (event.target.closest("a")) return;
    selectClinic(clinic.id, true);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectClinic(clinic.id, true);
    }
  });

  return card;
}

function selectClinic(id, focusMap) {
  selectedClinicId = id;
  document.querySelectorAll(".clinic-card").forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.clinicId === id);
  });

  const clinic = clinics.find((item) => item.id === id);
  const marker = markersById.get(id);
  if (!clinic || !marker) return;

  if (focusMap) {
    map.flyTo([clinic.lat, clinic.lng], Math.max(map.getZoom(), 14), { duration: 0.6 });
  }
  marker.openPopup();

  const card = document.querySelector(`[data-clinic-id="${CSS.escape(id)}"]`);
  card?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function resetFilters() {
  elements.filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === "all";
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function setLoadingState(message) {
  elements.clinicList.innerHTML = `
    <div class="loading-state">
      <p><strong>${escapeHtml(message)}</strong><span class="loading-dots"></span></p>
    </div>
  `;
  elements.resultCount.textContent = "Searching…";
  setMessage(message);
}

function showSearchError(message) {
  elements.clinicList.innerHTML = `
    <div class="empty-state">
      <span aria-hidden="true">⚠</span>
      <h3>We could not complete the search</h3>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
  elements.resultCount.textContent = "Unavailable";
  setMessage(message, true);
}

function setMessage(message, isError = false) {
  elements.formMessage.textContent = message;
  elements.formMessage.classList.toggle("is-error", isError);
}

function shortenLabel(label) {
  return label.split(",").slice(0, 2).join(",").trim();
}

function haversineMiles(lat1, lon1, lat2, lon2) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusMiles = 3958.8;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLon / 2) ** 2;
  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}
