const CARE_PLAN_STORAGE_KEY = "pawpath.activeCarePlan.v1";
const CARE_PLAN_SCHEMA_VERSION = 1;

const originalSetModeForCarePlan = setMode;
const originalSearchNearbyForCarePlan = searchNearby;
const originalRefreshSelectionPresentationForCarePlan = refreshSelectionPresentation;

let carePlanElements = {};
let activeStoredPlan = readStoredCarePlan();
let hasSavedCarePlan = Boolean(activeStoredPlan);
let skipFirstDestinationSync = hasSavedCarePlan;
let carePlanSaveTimer = null;

setMode = function setModeWithCarePlan(mode, announce = false) {
  originalSetModeForCarePlan(mode, announce);
  applyCarePlanMode(mode);
};

searchNearby = async function searchNearbyWithCarePlanDestination(center, label) {
  await originalSearchNearbyForCarePlan(center, label);

  if (skipFirstDestinationSync) {
    skipFirstDestinationSync = false;
    return;
  }

  if (activeMode === "plan" && carePlanElements.destination) {
    carePlanElements.destination.value = label || currentSearchLabel || "";
    scheduleCarePlanSave("Destination updated.");
  }
};

refreshSelectionPresentation = function refreshSelectionPresentationWithStorage() {
  originalRefreshSelectionPresentationForCarePlan();
  scheduleCarePlanSave("Care-plan facilities updated.");
};

document.addEventListener("DOMContentLoaded", initializeCarePlanPersistence);

function initializeCarePlanPersistence() {
  carePlanElements = {
    section: document.getElementById("care-plan-editor"),
    form: document.getElementById("care-plan-form"),
    name: document.getElementById("trip-name"),
    destination: document.getElementById("trip-destination"),
    startDate: document.getElementById("trip-start-date"),
    endDate: document.getElementById("trip-end-date"),
    petName: document.getElementById("pet-name"),
    ownerPhone: document.getElementById("owner-phone"),
    petNote: document.getElementById("pet-note"),
    saveButton: document.getElementById("save-care-plan"),
    clearButton: document.getElementById("clear-care-plan"),
    status: document.getElementById("care-plan-status"),
    savedState: document.getElementById("care-plan-saved-state"),
    selectionSection: document.getElementById("care-plan-selection"),
    facilitySelection: document.querySelector(".facility-plan-selection"),
  };

  carePlanElements.form.addEventListener("submit", handleCarePlanSubmit);
  carePlanElements.clearButton.addEventListener("click", clearActiveCarePlan);

  [
    carePlanElements.name,
    carePlanElements.destination,
    carePlanElements.startDate,
    carePlanElements.endDate,
    carePlanElements.petName,
    carePlanElements.ownerPhone,
    carePlanElements.petNote,
  ].forEach((field) => {
    field.addEventListener("input", () => scheduleCarePlanSave("Care-plan details updated."));
    field.addEventListener("change", () => scheduleCarePlanSave("Care-plan details updated."));
  });

  if (activeStoredPlan) {
    restoreCarePlan(activeStoredPlan);
    announceCarePlan("Saved care plan restored from this browser.");
  } else {
    carePlanElements.destination.value = currentSearchLabel || "";
    updateSavedState();
  }

  applyCarePlanMode(activeMode);
}

function handleCarePlanSubmit(event) {
  event.preventDefault();
  const validationMessage = validateCarePlanForm();

  if (validationMessage) {
    announceCarePlan(validationMessage, true);
    return;
  }

  persistCarePlan(hasSavedCarePlan ? "Care plan updated." : "Care plan saved to this browser.");
}

function validateCarePlanForm() {
  if (!carePlanElements.name.value.trim()) {
    carePlanElements.name.focus();
    return "Add a trip name before saving the care plan.";
  }

  if (!carePlanElements.destination.value.trim()) {
    carePlanElements.destination.focus();
    return "Add a destination before saving the care plan.";
  }

  if (!planSelections.primary) {
    return "Select a Primary emergency or urgent-care facility before saving.";
  }

  if (!planSelections.backup) {
    return "Select a distinct Backup facility before saving.";
  }

  if (
    carePlanElements.startDate.value &&
    carePlanElements.endDate.value &&
    carePlanElements.endDate.value < carePlanElements.startDate.value
  ) {
    carePlanElements.endDate.focus();
    return "The trip end date cannot be before the start date.";
  }

  return "";
}

function persistCarePlan(message, announce = true) {
  if (!hasSavedCarePlan && !message) return;

  const validationMessage = validateCarePlanFormWithoutFocus();
  if (validationMessage) {
    if (announce) announceCarePlan(validationMessage, true);
    return;
  }

  const now = new Date().toISOString();
  const plan = {
    schemaVersion: CARE_PLAN_SCHEMA_VERSION,
    id: activeStoredPlan?.id || createCarePlanId(),
    createdAt: activeStoredPlan?.createdAt || now,
    updatedAt: now,
    trip: {
      name: carePlanElements.name.value.trim(),
      destination: carePlanElements.destination.value.trim(),
      startDate: carePlanElements.startDate.value || "",
      endDate: carePlanElements.endDate.value || "",
    },
    traveler: {
      petName: carePlanElements.petName.value.trim(),
      ownerPhone: carePlanElements.ownerPhone.value.trim(),
      importantNote: carePlanElements.petNote.value.trim(),
    },
    facilities: {
      primary: sanitizeFacility(planSelections.primary),
      backup: sanitizeFacility(planSelections.backup),
      routine: null,
    },
  };

  try {
    localStorage.setItem(CARE_PLAN_STORAGE_KEY, JSON.stringify(plan));
    activeStoredPlan = plan;
    hasSavedCarePlan = true;
    updateSavedState();
    if (announce && message) announceCarePlan(message);
  } catch (error) {
    console.error("Care plan could not be saved:", error);
    announceCarePlan("This browser could not save the care plan. Check storage settings and try again.", true);
  }
}

function scheduleCarePlanSave(message) {
  if (!hasSavedCarePlan || !carePlanElements.form) return;

  window.clearTimeout(carePlanSaveTimer);
  carePlanSaveTimer = window.setTimeout(() => {
    persistCarePlan(message, false);
  }, 350);
}

function clearActiveCarePlan() {
  if (!hasSavedCarePlan && !planSelections.primary && !planSelections.backup) {
    announceCarePlan("There is no saved care plan to clear.");
    return;
  }

  const shouldClear = window.confirm(
    "Clear the saved trip details and remove the Primary and Backup selections from this browser?"
  );
  if (!shouldClear) return;

  try {
    localStorage.removeItem(CARE_PLAN_STORAGE_KEY);
  } catch (error) {
    console.warn("Stored care plan could not be removed:", error);
  }

  activeStoredPlan = null;
  hasSavedCarePlan = false;
  planSelections.primary = null;
  planSelections.backup = null;
  carePlanElements.form.reset();
  carePlanElements.destination.value = currentSearchLabel || "";
  renderSelectionSummary();
  renderClinics({ preserveView: true });
  updateSavedState();
  announceCarePlan("Care plan cleared from this browser.");
}

function restoreCarePlan(plan) {
  carePlanElements.name.value = plan.trip.name;
  carePlanElements.destination.value = plan.trip.destination;
  carePlanElements.startDate.value = plan.trip.startDate;
  carePlanElements.endDate.value = plan.trip.endDate;
  carePlanElements.petName.value = plan.traveler.petName;
  carePlanElements.ownerPhone.value = plan.traveler.ownerPhone;
  carePlanElements.petNote.value = plan.traveler.importantNote;

  planSelections.primary = plan.facilities.primary ? { ...plan.facilities.primary } : null;
  planSelections.backup = plan.facilities.backup ? { ...plan.facilities.backup } : null;
  renderSelectionSummary();
  updateSavedState();
}

function readStoredCarePlan() {
  let rawValue;

  try {
    rawValue = localStorage.getItem(CARE_PLAN_STORAGE_KEY);
  } catch (error) {
    console.warn("Care-plan storage is unavailable:", error);
    return null;
  }

  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue);
    if (!isValidStoredCarePlan(parsed)) throw new Error("Unsupported or malformed care-plan data.");
    return parsed;
  } catch (error) {
    console.warn("Stored care plan was ignored:", error);
    try {
      localStorage.removeItem(CARE_PLAN_STORAGE_KEY);
    } catch {
      // Storage may be blocked; failing safely is sufficient.
    }
    return null;
  }
}

function isValidStoredCarePlan(value) {
  if (!value || typeof value !== "object") return false;
  if (value.schemaVersion !== CARE_PLAN_SCHEMA_VERSION) return false;
  if (!isNonEmptyString(value.id) || !isIsoDate(value.createdAt) || !isIsoDate(value.updatedAt)) return false;
  if (!value.trip || !isNonEmptyString(value.trip.name) || !isNonEmptyString(value.trip.destination)) return false;
  if (!isOptionalDate(value.trip.startDate) || !isOptionalDate(value.trip.endDate)) return false;
  if (!value.traveler || typeof value.traveler !== "object") return false;
  if (!isString(value.traveler.petName) || !isString(value.traveler.ownerPhone) || !isString(value.traveler.importantNote)) return false;
  if (!value.facilities || !isValidFacility(value.facilities.primary) || !isValidFacility(value.facilities.backup)) return false;
  if (value.facilities.primary.id === value.facilities.backup.id) return false;
  return true;
}

function isValidFacility(facility) {
  if (!facility || typeof facility !== "object") return false;
  return (
    isNonEmptyString(facility.id) &&
    isNonEmptyString(facility.name) &&
    isString(facility.address) &&
    Number.isFinite(facility.lat) &&
    Number.isFinite(facility.lng) &&
    Number.isFinite(facility.distanceMiles) &&
    isNonEmptyString(facility.careType)
  );
}

function sanitizeFacility(facility) {
  if (!facility) return null;

  return {
    id: String(facility.id),
    name: String(facility.name || "Veterinary facility"),
    address: String(facility.address || ""),
    phone: String(facility.phone || ""),
    website: String(facility.website || ""),
    hours: String(facility.hours || ""),
    careType: String(facility.careType || "unknown"),
    confidence: String(facility.confidence || "needs-confirmation"),
    emergency: Boolean(facility.emergency),
    source: String(facility.source || ""),
    sourceUrl: String(facility.sourceUrl || ""),
    sourceNotes: String(facility.sourceNotes || ""),
    lat: Number(facility.lat),
    lng: Number(facility.lng),
    distanceMiles: Number(facility.distanceMiles),
    isExtendedEmergencySearch: Boolean(facility.isExtendedEmergencySearch),
  };
}

function validateCarePlanFormWithoutFocus() {
  if (!carePlanElements.name.value.trim()) return "The saved plan needs a trip name.";
  if (!carePlanElements.destination.value.trim()) return "The saved plan needs a destination.";
  if (!planSelections.primary || !planSelections.backup) return "The saved plan needs Primary and Backup facilities.";
  if (
    carePlanElements.startDate.value &&
    carePlanElements.endDate.value &&
    carePlanElements.endDate.value < carePlanElements.startDate.value
  ) {
    return "The trip dates are invalid.";
  }
  return "";
}

function applyCarePlanMode(mode) {
  document.body.dataset.appMode = mode;
  const isPlanning = mode === "plan";

  if (carePlanElements.section) carePlanElements.section.hidden = !isPlanning;
  if (carePlanElements.selectionSection) carePlanElements.selectionSection.hidden = !isPlanning;
  if (carePlanElements.facilitySelection) carePlanElements.facilitySelection.hidden = !isPlanning;
}

function updateSavedState() {
  if (!carePlanElements.savedState || !carePlanElements.clearButton || !carePlanElements.saveButton) return;

  if (!hasSavedCarePlan || !activeStoredPlan) {
    carePlanElements.savedState.textContent = "Not saved yet";
    carePlanElements.savedState.classList.remove("is-saved");
    carePlanElements.clearButton.hidden = true;
    carePlanElements.saveButton.textContent = "Save care plan";
    return;
  }

  const updated = new Date(activeStoredPlan.updatedAt);
  carePlanElements.savedState.textContent = `Saved locally · ${updated.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })}`;
  carePlanElements.savedState.classList.add("is-saved");
  carePlanElements.clearButton.hidden = false;
  carePlanElements.saveButton.textContent = "Update care plan";
}

function announceCarePlan(message, isError = false) {
  carePlanElements.status.textContent = message;
  carePlanElements.status.classList.toggle("is-error", isError);
}

function createCarePlanId() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `care-plan-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isString(value) {
  return typeof value === "string";
}

function isNonEmptyString(value) {
  return isString(value) && Boolean(value.trim());
}

function isIsoDate(value) {
  return isNonEmptyString(value) && !Number.isNaN(Date.parse(value));
}

function isOptionalDate(value) {
  return value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value);
}
