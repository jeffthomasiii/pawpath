const originalPersistCarePlanForSummary = persistCarePlan;
const originalClearActiveCarePlanForSummary = clearActiveCarePlan;

let planSummaryElements = {};

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

function initializeSavedPlanSummary() {
  injectPlanSummaryRegion();

  planSummaryElements = {
    region: document.getElementById("saved-plan-summary"),
    title: document.getElementById("saved-plan-title"),
    destination: document.getElementById("saved-plan-destination"),
    dates: document.getElementById("saved-plan-dates"),
    pet: document.getElementById("saved-plan-pet"),
    updated: document.getElementById("saved-plan-updated"),
    facilities: document.getElementById("saved-plan-facilities"),
    edit: document.getElementById("saved-plan-edit"),
    clear: document.getElementById("saved-plan-clear"),
    emergency: document.getElementById("saved-plan-emergency"),
    status: document.getElementById("saved-plan-status"),
  };

  planSummaryElements.edit.addEventListener("click", editSavedPlan);
  planSummaryElements.clear.addEventListener("click", () => {
    if (clearActiveCarePlan()) announceSavedPlan("Saved plan cleared.");
  });
  planSummaryElements.emergency.addEventListener("click", openSavedPlanEmergencyMode);

  document.querySelectorAll(".mode-option").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.mode === "plan") resetSavedPlanEmergencyState();
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
    <p id="saved-plan-status" class="sr-only" role="status" aria-live="polite"></p>
  `;

  const hero = document.getElementById("hero-panel");
  hero?.insertAdjacentElement("afterend", region);
}

function renderSavedPlanSummary() {
  if (!planSummaryElements.region) return;

  if (!activeStoredPlan || !hasSavedCarePlan) {
    planSummaryElements.region.hidden = true;
    resetSavedPlanEmergencyState();
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
  setMode("plan", true);
  resetSavedPlanEmergencyState();

  const editor = document.getElementById("care-plan-editor");
  editor?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  window.setTimeout(() => document.getElementById("trip-name")?.focus({ preventScroll: true }), 250);
  announceSavedPlan("Plan a Trip opened for editing.");
}

function openSavedPlanEmergencyMode() {
  setMode("now", true);
  planSummaryElements.region.classList.add("is-emergency-active");
  planSummaryElements.emergency.textContent = "Emergency Mode Active";
  planSummaryElements.region.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });

  const firstCall = planSummaryElements.region.querySelector('.saved-facility-card.is-primary a[href^="tel:"]');
  window.setTimeout(() => (firstCall || planSummaryElements.emergency).focus({ preventScroll: true }), 250);
  announceSavedPlan("Emergency Mode opened. Primary and Backup call and directions actions are ready.");
}

function resetSavedPlanEmergencyState() {
  if (!planSummaryElements.region || !planSummaryElements.emergency) return;
  planSummaryElements.region.classList.remove("is-emergency-active");
  planSummaryElements.emergency.textContent = "Open Emergency Mode";
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
