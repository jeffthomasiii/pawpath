const originalPersistCarePlanForSummary = persistCarePlan;
const originalClearActiveCarePlanForSummary = clearActiveCarePlan;

let planSummaryElements = {};
let emergencyModeReturnTarget = null;

persistCarePlan = function persistCarePlanWithSummary(message, announce = true) {
  originalPersistCarePlanForSummary(message, announce);
  renderSavedPlanSummary();
};

clearActiveCarePlan = function clearActiveCarePlanWithSummary() {
  const hadSavedPlan = Boolean(hasSavedCarePlan || activeStoredPlan);
  originalClearActiveCarePlanForSummary();
  renderSavedPlanSummary();
  return hadSavedPlan && !hasSavedCarePlan && !activeStoredPlan;
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSavedPlanSummary);
} else {
  initializeSavedPlanSummary();
}

window.addEventListener("storage", (event) => {
  if (event.key !== CARE_PLAN_STORAGE_KEY) return;
  activeStoredPlan = readStoredCarePlan();
  hasSavedCarePlan = Boolean(activeStoredPlan);
  renderSavedPlanSummary();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("is-emergency-mode")) {
    closeSavedPlanEmergencyMode();
  }
});

function initializeSavedPlanSummary() {
  injectPlanSummaryRegion();

  planSummaryElements = {
    region: document.getElementById("saved-plan-summary"),
    standard: document.getElementById("saved-plan-standard"),
    title: document.getElementById("saved-plan-title"),
    destination: document.getElementById("saved-plan-destination"),
    dates: document.getElementById("saved-plan-dates"),
    pet: document.getElementById("saved-plan-pet"),
    updated: document.getElementById("saved-plan-updated"),
    facilities: document.getElementById("saved-plan-facilities"),
    edit: document.getElementById("saved-plan-edit"),
    clear: document.getElementById("saved-plan-clear"),
    emergency: document.getElementById("saved-plan-emergency"),
    emergencyView: document.getElementById("emergency-mode-view"),
    emergencyTitle: document.getElementById("emergency-mode-title"),
    emergencyDestination: document.getElementById("emergency-mode-destination"),
    emergencyPrimary: document.getElementById("emergency-primary"),
    emergencyBackup: document.getElementById("emergency-backup"),
    emergencyTraveler: document.getElementById("emergency-traveler"),
    emergencyExit: document.getElementById("emergency-mode-exit"),
    status: document.getElementById("saved-plan-status"),
  };

  planSummaryElements.edit.addEventListener("click", editSavedPlan);
  planSummaryElements.clear.addEventListener("click", () => {
    if (clearActiveCarePlan()) announceSavedPlan("Saved plan cleared.");
  });
  planSummaryElements.emergency.addEventListener("click", openSavedPlanEmergencyMode);
  planSummaryElements.emergencyExit.addEventListener("click", closeSavedPlanEmergencyMode);

  document.querySelectorAll(".mode-option").forEach((button) => {
    button.addEventListener("click", () => {
      if (document.body.classList.contains("is-emergency-mode")) closeSavedPlanEmergencyMode(false);
    });
  });

  renderSavedPlanSummary();
}

function injectPlanSummaryRegion() {
  if (document.getElementById("saved-plan-summary")) return;

  const region = document.createElement("section");
  region.id = "saved-plan-summary";
  region.className = "saved-plan-summary";
  region.hidden = true;
  region.setAttribute("aria-labelledby", "saved-plan-title");

  region.innerHTML = `
    <div id="saved-plan-standard">
      <div class="saved-plan-summary-header">
        <div>
          <p class="eyebrow">Active care plan</p>
          <h2 id="saved-plan-title">Saved trip plan</h2>
          <p id="saved-plan-destination" class="saved-plan-destination"></p>
        </div>
        <button id="saved-plan-emergency" class="button saved-plan-emergency-button" type="button">
          Open Emergency Mode
        </button>
      </div>

      <div class="saved-plan-trip-meta" aria-label="Saved trip details">
        <span id="saved-plan-dates"></span>
        <span id="saved-plan-pet"></span>
        <span id="saved-plan-updated"></span>
      </div>

      <div id="saved-plan-facilities" class="saved-plan-facilities"></div>

      <div class="saved-plan-summary-footer">
        <div class="saved-plan-secondary-actions">
          <button id="saved-plan-edit" class="text-button" type="button">Edit Plan</button>
          <button id="saved-plan-clear" class="text-button is-destructive" type="button">Clear Plan</button>
        </div>
        <p class="saved-plan-call-ahead">Call ahead to confirm services, hours, and availability.</p>
      </div>
    </div>

    <div id="emergency-mode-view" class="emergency-mode-view" hidden>
      <header class="emergency-mode-header">
        <div>
          <p class="eyebrow">Emergency Mode</p>
          <h2 id="emergency-mode-title">Use your saved care plan</h2>
          <p id="emergency-mode-destination" class="emergency-mode-destination"></p>
        </div>
        <button id="emergency-mode-exit" class="button button-secondary emergency-mode-exit" type="button">Exit Emergency Mode</button>
      </header>

      <p class="emergency-mode-guidance"><strong>Call ahead:</strong> Confirm the facility is open, available, and able to treat your pet before driving when possible.</p>

      <section id="emergency-primary" class="emergency-facility is-primary" aria-labelledby="emergency-primary-title"></section>
      <section id="emergency-backup" class="emergency-facility is-backup" aria-labelledby="emergency-backup-title"></section>

      <section class="emergency-traveler-card" aria-labelledby="emergency-traveler-title">
        <div>
          <p class="eyebrow">Saved trip details</p>
          <h3 id="emergency-traveler-title">Pet and owner information</h3>
        </div>
        <dl id="emergency-traveler" class="emergency-traveler-details"></dl>
      </section>

      <p class="emergency-mode-disclaimer">PawPath does not diagnose conditions or guarantee facility hours, availability, services, or suitability for a specific pet.</p>
    </div>

    <p id="saved-plan-status" class="sr-only" role="status" aria-live="polite"></p>
  `;

  const hero = document.getElementById("hero-panel");
  hero?.insertAdjacentElement("afterend", region);
}

function renderSavedPlanSummary() {
  if (!planSummaryElements.region) return;

  if (!activeStoredPlan || !hasSavedCarePlan) {
    closeSavedPlanEmergencyMode(false);
    planSummaryElements.region.hidden = true;
    planSummaryElements.facilities.innerHTML = "";
    return;
  }

  const plan = activeStoredPlan;
  planSummaryElements.region.hidden = false;
  planSummaryElements.title.textContent = plan.trip.name;
  planSummaryElements.destination.textContent = plan.trip.destination;
  planSummaryElements.dates.textContent = formatSavedPlanDates(plan.trip.startDate, plan.trip.endDate);
  planSummaryElements.pet.textContent = plan.traveler.petName ? `Pet: ${plan.traveler.petName}` : "Pet name not added";
  planSummaryElements.updated.textContent = `Updated ${formatSavedPlanTimestamp(plan.updatedAt)}`;

  planSummaryElements.facilities.innerHTML = "";
  planSummaryElements.facilities.append(
    createSavedFacilityCard("Primary", plan.facilities.primary, "primary"),
    createSavedFacilityCard("Backup", plan.facilities.backup, "backup")
  );

  renderEmergencyMode(plan);
}

function renderEmergencyMode(plan) {
  planSummaryElements.emergencyTitle.textContent = plan.trip.name;
  planSummaryElements.emergencyDestination.textContent = plan.trip.destination;
  renderEmergencyFacility(planSummaryElements.emergencyPrimary, plan.facilities.primary, "Primary", true);
  renderEmergencyFacility(planSummaryElements.emergencyBackup, plan.facilities.backup, "Backup", false);

  const details = [
    ["Pet", plan.traveler.petName || "Not added"],
    ["Owner phone", plan.traveler.ownerPhone || "Not added"],
    ["Important note", plan.traveler.importantNote || "No note added"],
  ];

  planSummaryElements.emergencyTraveler.innerHTML = details
    .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
    .join("");
}

function renderEmergencyFacility(container, facility, role, dominant) {
  const titleId = role === "Primary" ? "emergency-primary-title" : "emergency-backup-title";
  const phoneMarkup = facility.phone
    ? `<a class="button button-primary emergency-action" href="tel:${facility.phone.replace(/[^+\d]/g, "")}" aria-label="Call ${escapeHtml(facility.name)}">Call ${role}</a>`
    : `<span class="emergency-action-unavailable" role="status">Phone not listed</span>`;

  container.innerHTML = `
    <div class="emergency-facility-heading">
      <span class="selection-role-label ${role === "Primary" ? "is-primary" : "is-backup"}">${role}</span>
      <span class="saved-facility-care-type">${escapeHtml(formatSavedCareType(facility.careType))}</span>
    </div>
    <h3 id="${titleId}">${escapeHtml(facility.name)}</h3>
    <p class="emergency-facility-address">${escapeHtml(facility.address || "Address not listed")}</p>
    <p class="emergency-facility-distance">${Number.isFinite(facility.distanceMiles) ? `${facility.distanceMiles.toFixed(1)} mi from saved destination` : "Distance unavailable"}</p>
    <div class="emergency-facility-actions ${dominant ? "is-dominant" : ""}">
      ${phoneMarkup}
      <a class="button button-secondary emergency-action" href="${buildSavedFacilityDirectionsUrl(facility)}" target="_blank" rel="noopener noreferrer" aria-label="Open directions to ${escapeHtml(facility.name)}">Directions ↗</a>
    </div>
  `;
}

function createSavedFacilityCard(roleLabel, facility, role) {
  const card = document.createElement("article");
  card.className = `saved-facility-card is-${role}`;
  const roleClass = role === "primary" ? "is-primary" : "is-backup";
  const phoneAction = createFacilityPhoneAction(facility);
  const directionsAction = createFacilityDirectionsAction(facility);

  card.innerHTML = `
    <div class="saved-facility-card-heading">
      <span class="selection-role-label ${roleClass}">${roleLabel}</span>
      <span class="saved-facility-care-type">${escapeHtml(formatSavedCareType(facility.careType))}</span>
    </div>
    <h3>${escapeHtml(facility.name)}</h3>
    <p>${escapeHtml(facility.address || "Address not listed")}</p>
    <p class="saved-facility-distance">${Number.isFinite(facility.distanceMiles) ? `${facility.distanceMiles.toFixed(1)} mi from saved destination` : "Distance unavailable"}</p>
    <div class="saved-facility-actions"></div>
  `;

  const actions = card.querySelector(".saved-facility-actions");
  if (phoneAction) actions.append(phoneAction);
  actions.append(directionsAction);
  return card;
}

function createFacilityPhoneAction(facility) {
  if (!facility.phone) return null;
  const link = document.createElement("a");
  link.className = "button button-primary saved-facility-action";
  link.href = `tel:${facility.phone.replace(/[^+\d]/g, "")}`;
  link.textContent = "Call";
  link.setAttribute("aria-label", `Call ${facility.name}`);
  return link;
}

function createFacilityDirectionsAction(facility) {
  const link = document.createElement("a");
  link.className = "button button-secondary saved-facility-action";
  link.href = buildSavedFacilityDirectionsUrl(facility);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Directions ↗";
  link.setAttribute("aria-label", `Open directions to ${facility.name}`);
  return link;
}

function editSavedPlan() {
  closeSavedPlanEmergencyMode(false);
  setMode("plan", true);
  const editor = document.getElementById("care-plan-editor");
  editor?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  window.setTimeout(() => document.getElementById("trip-name")?.focus({ preventScroll: true }), 250);
  announceSavedPlan("Plan a Trip opened for editing.");
}

function openSavedPlanEmergencyMode() {
  if (!activeStoredPlan || !hasSavedCarePlan) {
    announceSavedPlan("Save a valid care plan before opening Emergency Mode.");
    return;
  }

  emergencyModeReturnTarget = document.activeElement instanceof HTMLElement ? document.activeElement : planSummaryElements.emergency;
  setMode("now", true);
  document.body.classList.add("is-emergency-mode");
  planSummaryElements.standard.hidden = true;
  planSummaryElements.emergencyView.hidden = false;
  planSummaryElements.region.classList.add("is-emergency-active");
  planSummaryElements.region.setAttribute("aria-labelledby", "emergency-mode-title");
  planSummaryElements.region.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });

  const firstAction = planSummaryElements.emergencyPrimary.querySelector('a[href^="tel:"]') ||
    planSummaryElements.emergencyPrimary.querySelector("a[href]") ||
    planSummaryElements.emergencyExit;
  window.setTimeout(() => firstAction.focus({ preventScroll: true }), 250);
  announceSavedPlan("Emergency Mode opened. Primary actions are ready, with Backup immediately below.");
}

function closeSavedPlanEmergencyMode(restoreFocus = true) {
  if (!planSummaryElements.region) return;
  const wasOpen = document.body.classList.contains("is-emergency-mode");
  document.body.classList.remove("is-emergency-mode");
  planSummaryElements.region.classList.remove("is-emergency-active");
  if (planSummaryElements.standard) planSummaryElements.standard.hidden = false;
  if (planSummaryElements.emergencyView) planSummaryElements.emergencyView.hidden = true;
  planSummaryElements.region.setAttribute("aria-labelledby", "saved-plan-title");

  if (wasOpen && restoreFocus && emergencyModeReturnTarget?.isConnected) {
    window.setTimeout(() => emergencyModeReturnTarget.focus({ preventScroll: true }), 0);
  }
  if (wasOpen) announceSavedPlan("Emergency Mode closed.");
}

function resetSavedPlanEmergencyState() {
  closeSavedPlanEmergencyMode(false);
}

function announceSavedPlan(message) {
  if (!planSummaryElements.status) return;
  planSummaryElements.status.textContent = "";
  window.requestAnimationFrame(() => {
    planSummaryElements.status.textContent = message;
  });
}

function formatSavedPlanDates(startDate, endDate) {
  if (!startDate && !endDate) return "Travel dates not added";
  if (startDate && !endDate) return `Starts ${formatDateValue(startDate)}`;
  if (!startDate && endDate) return `Ends ${formatDateValue(endDate)}`;
  return `${formatDateValue(startDate)} – ${formatDateValue(endDate)}`;
}

function formatDateValue(value) {
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function formatSavedPlanTimestamp(value) {
  const date = new Date(value);
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function formatSavedCareType(value) {
  if (value === "emergency") return "Emergency care";
  if (value === "urgent") return "Urgent care";
  if (value === "routine") return "Routine care";
  return "Care type unknown";
}

function buildSavedFacilityDirectionsUrl(facility) {
  const destination = Number.isFinite(facility.lat) && Number.isFinite(facility.lng)
    ? `${facility.lat},${facility.lng}`
    : facility.address || facility.name;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}
