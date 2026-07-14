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
  status: "idle",
  facility: null,
  center: null,
};

MODE_CONTENT.plan.locationButton = "Use my location";
document.addEventListener("DOMContentLoaded", installEmergencyFallbackRenderHook);

fetchVeterinaryClinics = async function fetchVeterinaryClinicsWithEmergencyFallback(center) {
  emergencyFallbackState = { status: "idle", facility: null, center };

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

    if (!nearestFallback) {
      emergencyFallbackState = { status: "not-found", facility: null, center };
      return nearbyClinics;
    }

    nearestFallback.isExtendedEmergencySearch = true;
    nearestFallback.searchScope = "expanded-emergency";
    nearestFallback.sourceNotes = `${nearestFallback.sourceNotes} PawPath included this facility because no emergency or urgent-care listing appeared within the normal ${NORMAL_SEARCH_RADIUS_MILES.toFixed(1)}-mile search area.`;
    emergencyFallbackState = { status: "added", facility: nearestFallback, center };

    return [...nearbyClinics, nearestFallback].sort((a, b) => a.distanceMiles - b.distanceMiles);
  } catch (error) {
    console.warn("Extended emergency-care search failed:", error);
    emergencyFallbackState = { status: "error", facility: null, center };
    return nearbyClinics;
  }
};

searchNearby = async function searchNearbyWithEmergencyFallback(center, label) {
  await originalSearchNearbyForFallback(center, label);
  updateEmergencyFallbackPresentation();

  if (emergencyFallbackState.status === "added" && emergencyFallbackState.facility) {
    const facility = emergencyFallbackState.facility;
    setMessage(
      `No emergency or urgent-care listing appeared within ${NORMAL_SEARCH_RADIUS_MILES.toFixed(1)} miles, so PawPath added the nearest likely option within ${EMERGENCY_FALLBACK_RADIUS_MILES.toFixed(0)} miles: ${facility.name} (${facility.distanceMiles.toFixed(1)} miles away). Call ahead to confirm services and availability.`
    );
  } else if (emergencyFallbackState.status === "not-found") {
    setMessage(
      `No emergency or urgent-care facility could be identified in OpenStreetMap within ${EMERGENCY_FALLBACK_RADIUS_MILES.toFixed(0)} miles. Use the external emergency-search link and call ahead to confirm care.`
    );
  }
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

  if (emergencyFallbackState.status === "idle") {
    notice.hidden = true;
    notice.innerHTML = "";
    return;
  }

  if (emergencyFallbackState.status === "not-found" || emergencyFallbackState.status === "error") {
    const searchUrl = buildExternalEmergencySearchUrl(emergencyFallbackState.center);
    notice.hidden = false;
    notice.classList.add("is-unresolved");
    notice.innerHTML = `
      <strong>Emergency facility not identified</strong>
      <span>OpenStreetMap did not provide enough information to identify an emergency or urgent-care facility within ${EMERGENCY_FALLBACK_RADIUS_MILES.toFixed(0)} miles.</span>
      <a href="${escapeAttribute(searchUrl)}" target="_blank" rel="noopener noreferrer">Search emergency veterinarians externally ↗</a>
    `;
    return;
  }

  notice.classList.remove("is-unresolved");

  if (emergencyFallbackState.status !== "added" || !emergencyFallbackState.facility) {
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
  const query = `
    [out:json][timeout:30];
    (
      node["amenity"="veterinary"](around:${EMERGENCY_FALLBACK_RADIUS_METERS},${center.lat},${center.lng});
      way["amenity"="veterinary"](around:${EMERGENCY_FALLBACK_RADIUS_METERS},${center.lat},${center.lng});
      relation["amenity"="veterinary"](around:${EMERGENCY_FALLBACK_RADIUS_METERS},${center.lat},${center.lng});
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
    if (!clinic) return;

    const evidence = getEmergencyEvidence(item.tags || {}, clinic);
    if (!evidence) return;

    clinic.careType = evidence.careType;
    clinic.emergency = true;
    clinic.confidence = evidence.confidence;
    clinic.sourceNotes = `${clinic.sourceNotes} ${evidence.note}`;
    uniqueClinics.set(clinic.id, clinic);
  });

  return [...uniqueClinics.values()].sort((a, b) => a.distanceMiles - b.distanceMiles);
}

function getEmergencyEvidence(tags, clinic) {
  const emergencyTag = String(tags.emergency || tags["veterinary:emergency"] || "").toLowerCase();
  const speciality = String(tags["healthcare:speciality"] || tags.speciality || "").toLowerCase();
  const openingHours = String(tags.opening_hours || "").toLowerCase();
  const searchableText = [
    clinic.name,
    tags.operator,
    tags.brand,
    tags.description,
    tags.note,
    tags["healthcare:speciality"],
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (emergencyTag === "yes" || speciality.includes("emergency")) {
    return {
      careType: "emergency",
      confidence: "source-listed",
      note: "The source record explicitly indicates emergency veterinary capability. Confirm current hours and availability by phone.",
    };
  }

  if (speciality.includes("urgent") || /\burgent\b/.test(searchableText)) {
    return {
      careType: "urgent",
      confidence: "likely-emergency",
      note: "Urgent-care capability is inferred from the source record and must be confirmed by phone.",
    };
  }

  if (/\bemergency\b|\b24[ -]?hour\b|\b24\/7\b/.test(searchableText)) {
    return {
      careType: "emergency",
      confidence: "likely-emergency",
      note: "Emergency capability is inferred from the facility name or source description and must be confirmed by phone.",
    };
  }

  if (/24\/7|00:00-24:00|00:00-00:00/.test(openingHours)) {
    return {
      careType: "emergency",
      confidence: "likely-emergency",
      note: "The listing appears to operate continuously, but emergency capability is not explicitly verified. Call before traveling.",
    };
  }

  return null;
}

function buildExternalEmergencySearchUrl(center) {
  const locationText = center && Number.isFinite(center.lat) && Number.isFinite(center.lng)
    ? ` near ${center.lat.toFixed(5)},${center.lng.toFixed(5)}`
    : "";
  const query = encodeURIComponent(`emergency veterinarian${locationText}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function isEmergencyOrUrgentFacility(clinic) {
  return clinic.careType === "emergency" || clinic.careType === "urgent";
}
