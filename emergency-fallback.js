const EMERGENCY_FALLBACK_RADIUS_METERS = 48280;
const METERS_PER_MILE = 1609.344;
const NORMAL_SEARCH_RADIUS_MILES = SEARCH_RADIUS_METERS / METERS_PER_MILE;
const EMERGENCY_FALLBACK_RADIUS_MILES = EMERGENCY_FALLBACK_RADIUS_METERS / METERS_PER_MILE;
const SEARCH_RADIUS_TOLERANCE_MILES = 0.35;

const originalFetchVeterinaryClinicsForFallback = fetchVeterinaryClinics;
const originalSearchNearbyForFallback = searchNearby;
let originalRenderClinicsForFallback = null;
let emergencyFallbackRenderHookInstalled = false;

let emergencyFallbackState = {
  added: false,
  facility: null,
};

MODE_CONTENT.plan.locationButton = "Use my location";
document.addEventListener("DOMContentLoaded", installEmergencyFallbackRenderHook);

fetchVeterinaryClinics = async function fetchVeterinaryClinicsWithEmergencyFallback(center) {
  emergencyFallbackState = { added: false, facility: null };

  const fetchedClinics = await originalFetchVeterinaryClinicsForFallback(center);
  const nearbyClinics = fetchedClinics.filter(
    (clinic) => clinic.distanceMiles <= NORMAL_SEARCH_RADIUS_MILES + SEARCH_RADIUS_TOLERANCE_MILES
  );

  if (nearbyClinics.some(isEmergencyOrUrgentFacility)) return nearbyClinics;

  try {
    const fallbackCandidates = await fetchEmergencyFallbackCandidates(center);
    const nearbyIds = new Set(nearbyClinics.map((clinic) => clinic.id));
    const nearestFallback = fallbackCandidates
      .filter((clinic) => !nearbyIds.has(clinic.id))
      .filter((clinic) => clinic.distanceMiles > NORMAL_SEARCH_RADIUS_MILES)
      .filter((clinic) => clinic.distanceMiles <= EMERGENCY_FALLBACK_RADIUS_MILES)
      .sort((a, b) => a.distanceMiles - b.distanceMiles)[0];

    if (!nearestFallback) return nearbyClinics;

    nearestFallback.isExtendedEmergencySearch = true;
    nearestFallback.searchScope = "expanded-emergency";
    nearestFallback.sourceNotes = `${nearestFallback.sourceNotes} PawPath included this facility because no emergency or urgent-care listing appeared within the normal ${NORMAL_SEARCH_RADIUS_MILES.toFixed(1)}-mile search area.`;
    emergencyFallbackState = { added: true, facility: nearestFallback };

    return [...nearbyClinics, nearestFallback].sort((a, b) => a.distanceMiles - b.distanceMiles);
  } catch (error) {
    console.warn("Extended emergency-care search failed:", error);
    return nearbyClinics;
  }
};

searchNearby = async function searchNearbyWithEmergencyFallback(center, label) {
  await originalSearchNearbyForFallback(center, label);
  updateEmergencyFallbackPresentation();

  if (!emergencyFallbackState.added || !emergencyFallbackState.facility) return;

  const facility = emergencyFallbackState.facility;
  setMessage(
    `No emergency or urgent-care listing appeared within ${NORMAL_SEARCH_RADIUS_MILES.toFixed(1)} miles, so PawPath added the nearest likely option within ${EMERGENCY_FALLBACK_RADIUS_MILES.toFixed(0)} miles: ${facility.name} (${facility.distanceMiles.toFixed(1)} miles away). Call ahead to confirm services and availability.`
  );
};

function installEmergencyFallbackRenderHook() {
  if (emergencyFallbackRenderHookInstalled) return;

  originalRenderClinicsForFallback = renderClinics;
  renderClinics = function renderClinicsWithEmergencyFallback(options = {}) {
    originalRenderClinicsForFallback(options);
    updateEmergencyFallbackPresentation();
  };
  emergencyFallbackRenderHookInstalled = true;
}

function updateEmergencyFallbackPresentation() {
  const notice = ensureExpandedSearchNotice();

  document.querySelectorAll(".extended-emergency-note").forEach((element) => element.remove());
  document.querySelectorAll(".clinic-card.is-extended-emergency").forEach((element) => {
    element.classList.remove("is-extended-emergency");
  });
  document.querySelectorAll(".custom-marker.is-expanded-emergency").forEach((element) => {
    element.classList.remove("is-expanded-emergency");
  });

  if (!emergencyFallbackState.added || !emergencyFallbackState.facility) {
    notice.hidden = true;
    notice.innerHTML = "";
    return;
  }

  const facility = emergencyFallbackState.facility;
  notice.hidden = false;
  notice.innerHTML = `
    <strong>Expanded emergency search</strong>
    <span>No emergency or urgent-care listing was found within ${NORMAL_SEARCH_RADIUS_MILES.toFixed(1)} miles. Showing the nearest likely option: ${escapeHtml(facility.name)}, ${facility.distanceMiles.toFixed(1)} miles away.</span>
  `;

  const card = document.querySelector(`[data-clinic-id="${CSS.escape(facility.id)}"]`);
  if (card) {
    card.classList.add("is-extended-emergency");
    card.setAttribute(
      "aria-label",
      `Nearest emergency option from an expanded search. View details for ${facility.name}`
    );

    const note = document.createElement("div");
    note.className = "extended-emergency-note";
    note.innerHTML = `
      <strong>Nearest emergency option</strong>
      <span>Expanded search · ${facility.distanceMiles.toFixed(1)} mi away</span>
    `;

    const header = card.querySelector(".clinic-card-header");
    header?.insertAdjacentElement("afterend", note);
  }

  const marker = markersById.get(facility.id);
  marker?.getElement()?.querySelector(".custom-marker")?.classList.add("is-expanded-emergency");
}

function ensureExpandedSearchNotice() {
  let notice = document.getElementById("expanded-emergency-search-notice");
  if (notice) return notice;

  notice = document.createElement("div");
  notice.id = "expanded-emergency-search-notice";
  notice.className = "expanded-emergency-search-notice";
  notice.setAttribute("role", "status");
  notice.setAttribute("aria-live", "polite");
  notice.hidden = true;

  const filterRow = document.querySelector(".filter-row");
  filterRow?.insertAdjacentElement("afterend", notice);
  return notice;
}

async function fetchEmergencyFallbackCandidates(center) {
  const emergencyNamePattern = "emergency|urgent|24[ -]?hour|24/7";
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="veterinary"]["emergency"="yes"](around:${EMERGENCY_FALLBACK_RADIUS_METERS},${center.lat},${center.lng});
      way["amenity"="veterinary"]["emergency"="yes"](around:${EMERGENCY_FALLBACK_RADIUS_METERS},${center.lat},${center.lng});
      relation["amenity"="veterinary"]["emergency"="yes"](around:${EMERGENCY_FALLBACK_RADIUS_METERS},${center.lat},${center.lng});
      node["amenity"="veterinary"]["healthcare:speciality"~"emergency",i](around:${EMERGENCY_FALLBACK_RADIUS_METERS},${center.lat},${center.lng});
      way["amenity"="veterinary"]["healthcare:speciality"~"emergency",i](around:${EMERGENCY_FALLBACK_RADIUS_METERS},${center.lat},${center.lng});
      relation["amenity"="veterinary"]["healthcare:speciality"~"emergency",i](around:${EMERGENCY_FALLBACK_RADIUS_METERS},${center.lat},${center.lng});
      node["amenity"="veterinary"]["name"~"${emergencyNamePattern}",i](around:${EMERGENCY_FALLBACK_RADIUS_METERS},${center.lat},${center.lng});
      way["amenity"="veterinary"]["name"~"${emergencyNamePattern}",i](around:${EMERGENCY_FALLBACK_RADIUS_METERS},${center.lat},${center.lng});
      relation["amenity"="veterinary"]["name"~"${emergencyNamePattern}",i](around:${EMERGENCY_FALLBACK_RADIUS_METERS},${center.lat},${center.lng});
    );
    out center tags;
  `;

  const response = await fetch(OVERPASS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: new URLSearchParams({ data: query }),
  });

  if (!response.ok) {
    throw new Error(`Extended Overpass request failed with status ${response.status}`);
  }

  const data = await response.json();
  const uniqueClinics = new Map();

  data.elements.forEach((item) => {
    const clinic = normalizeClinic(item, center);
    if (!clinic || !isEmergencyOrUrgentFacility(clinic)) return;
    uniqueClinics.set(clinic.id, clinic);
  });

  return [...uniqueClinics.values()].sort((a, b) => a.distanceMiles - b.distanceMiles);
}

function isEmergencyOrUrgentFacility(clinic) {
  return clinic.careType === "emergency" || clinic.careType === "urgent";
}
