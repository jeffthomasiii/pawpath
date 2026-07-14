const EMERGENCY_FALLBACK_RADIUS_METERS = 48280;
const METERS_PER_MILE = 1609.344;
const NORMAL_SEARCH_RADIUS_MILES = Math.round(SEARCH_RADIUS_METERS / METERS_PER_MILE);
const EMERGENCY_FALLBACK_RADIUS_MILES = Math.round(EMERGENCY_FALLBACK_RADIUS_METERS / METERS_PER_MILE);

const originalFetchVeterinaryClinicsForFallback = fetchVeterinaryClinics;
const originalSearchNearbyForFallback = searchNearby;
const originalCreateClinicCardForFallback = createClinicCard;

let emergencyFallbackState = {
  added: false,
  facility: null,
};

MODE_CONTENT.plan.locationButton = "Use my location";

fetchVeterinaryClinics = async function fetchVeterinaryClinicsWithEmergencyFallback(center) {
  emergencyFallbackState = { added: false, facility: null };

  const nearbyClinics = await originalFetchVeterinaryClinicsForFallback(center);
  if (nearbyClinics.some(isEmergencyOrUrgentFacility)) return nearbyClinics;

  try {
    const fallbackCandidates = await fetchEmergencyFallbackCandidates(center);
    const nearbyIds = new Set(nearbyClinics.map((clinic) => clinic.id));
    const nearestFallback = fallbackCandidates
      .filter((clinic) => !nearbyIds.has(clinic.id))
      .filter((clinic) => clinic.distanceMiles <= EMERGENCY_FALLBACK_RADIUS_MILES)
      .sort((a, b) => a.distanceMiles - b.distanceMiles)[0];

    if (!nearestFallback) return nearbyClinics;

    nearestFallback.isExtendedEmergencySearch = true;
    nearestFallback.sourceNotes = `${nearestFallback.sourceNotes} PawPath included this facility because no emergency or urgent-care listing appeared within the normal ${NORMAL_SEARCH_RADIUS_MILES}-mile search area.`;
    emergencyFallbackState = { added: true, facility: nearestFallback };

    return [...nearbyClinics, nearestFallback].sort((a, b) => a.distanceMiles - b.distanceMiles);
  } catch (error) {
    console.warn("Extended emergency-care search failed:", error);
    return nearbyClinics;
  }
};

searchNearby = async function searchNearbyWithEmergencyFallback(center, label) {
  await originalSearchNearbyForFallback(center, label);

  if (!emergencyFallbackState.added || !emergencyFallbackState.facility) return;

  const facility = emergencyFallbackState.facility;
  setMessage(
    `No emergency or urgent-care listing appeared within ${NORMAL_SEARCH_RADIUS_MILES} miles, so PawPath added the nearest likely option within ${EMERGENCY_FALLBACK_RADIUS_MILES} miles: ${facility.name} (${facility.distanceMiles.toFixed(1)} miles away). Call ahead to confirm services and availability.`
  );
};

createClinicCard = function createClinicCardWithEmergencyFallback(clinic) {
  const card = originalCreateClinicCardForFallback(clinic);

  if (!clinic.isExtendedEmergencySearch) return card;

  card.classList.add("is-extended-emergency");
  const note = document.createElement("div");
  note.className = "extended-emergency-note";
  note.innerHTML = `
    <strong>Nearest emergency option</strong>
    <span>Expanded search · ${clinic.distanceMiles.toFixed(1)} mi away</span>
  `;

  const header = card.querySelector(".clinic-card-header");
  header?.insertAdjacentElement("afterend", note);
  return card;
};

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
