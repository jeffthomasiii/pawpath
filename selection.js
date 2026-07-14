const planSelections = {
  primary: null,
  backup: null,
};

let currentSelectionClinic = null;
let selectionElements = {};

const originalCreateClinicCard = createClinicCard;
const originalCreateMarker = createMarker;
const originalOpenFacilityDetail = openFacilityDetail;
const originalRenderClinics = renderClinics;

createClinicCard = function createSelectionAwareClinicCard(clinic) {
  const card = originalCreateClinicCard(clinic);
  const role = getFacilityRole(clinic.id);

  if (role) {
    const roleBanner = document.createElement("div");
    roleBanner.className = `card-plan-role is-${role}`;
    roleBanner.innerHTML = `<span aria-hidden="true">${role === "primary" ? "P" : "B"}</span>${capitalize(role)} care-plan option`;
    const header = card.querySelector(".clinic-card-header");
    header?.insertAdjacentElement("afterend", roleBanner);
  }

  return card;
};

createMarker = function createSelectionAwareMarker(clinic) {
  const marker = originalCreateMarker(clinic);
  marker.setIcon(createPlanMarkerIcon(clinic));
  return marker;
};

openFacilityDetail = function openSelectionAwareFacilityDetail(clinic, triggerElement) {
  currentSelectionClinic = clinic;
  originalOpenFacilityDetail(clinic, triggerElement);
  updateDetailSelectionControls(clinic);
};

renderClinics = function renderSelectionAwareClinics(options = {}) {
  const preserveView = Boolean(options.preserveView && map);
  const currentCenter = preserveView ? map.getCenter() : null;
  const currentZoom = preserveView ? map.getZoom() : null;

  originalRenderClinics();

  if (preserveView && currentCenter && Number.isFinite(currentZoom)) {
    map.setView(currentCenter, currentZoom, { animate: false });
  }
};

document.addEventListener("DOMContentLoaded", initializeFacilitySelections);

function initializeFacilitySelections() {
  selectionElements = {
    summary: document.getElementById("care-plan-selection"),
    primarySlot: document.getElementById("primary-selection-slot"),
    primaryName: document.getElementById("primary-selection-name"),
    primaryMeta: document.getElementById("primary-selection-meta"),
    primaryView: document.getElementById("primary-selection-view"),
    primaryRemove: document.getElementById("primary-selection-remove"),
    backupSlot: document.getElementById("backup-selection-slot"),
    backupName: document.getElementById("backup-selection-name"),
    backupMeta: document.getElementById("backup-selection-meta"),
    backupView: document.getElementById("backup-selection-view"),
    backupRemove: document.getElementById("backup-selection-remove"),
    selectionStatus: document.getElementById("selection-status"),
    detailRoleStatus: document.getElementById("detail-role-status"),
    detailPlanMessage: document.getElementById("detail-plan-message"),
    selectPrimary: document.getElementById("select-primary"),
    selectBackup: document.getElementById("select-backup"),
  };

  selectionElements.selectPrimary.addEventListener("click", () => handleRoleAction("primary"));
  selectionElements.selectBackup.addEventListener("click", () => handleRoleAction("backup"));
  selectionElements.primaryView.addEventListener("click", () => openSelectionFromSummary("primary"));
  selectionElements.backupView.addEventListener("click", () => openSelectionFromSummary("backup"));
  selectionElements.primaryRemove.addEventListener("click", () => removeFacilityRole("primary"));
  selectionElements.backupRemove.addEventListener("click", () => removeFacilityRole("backup"));

  renderSelectionSummary();
}

function createPlanMarkerIcon(clinic) {
  const role = getFacilityRole(clinic.id);
  const roleClass = role ? ` is-${role}` : "";
  const markerLabel = role === "primary" ? "P" : role === "backup" ? "B" : "✚";

  return L.divIcon({
    className: "",
    html: `<div class="custom-marker${clinic.emergency ? " is-emergency" : ""}${roleClass}"><span aria-hidden="true">${markerLabel}</span></div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32],
  });
}

function handleRoleAction(role) {
  const clinic = currentSelectionClinic;
  if (!clinic) return;

  const currentRole = getFacilityRole(clinic.id);
  if (currentRole === role) {
    removeFacilityRole(role);
    return;
  }

  if (role === "primary" && !isPrimaryEligible(clinic)) {
    const message = "Primary care-plan options must be listed as emergency or urgent care. This facility may still be used as the backup option.";
    announceSelection(message, true);
    return;
  }

  const oppositeRole = role === "primary" ? "backup" : "primary";
  const oppositeSelection = planSelections[oppositeRole];
  const existingSelection = planSelections[role];

  if (oppositeSelection?.id === clinic.id) {
    const shouldMove = window.confirm(
      `${clinic.name} is currently your ${capitalize(oppositeRole)} option. Move it to ${capitalize(role)}?`
    );
    if (!shouldMove) return;
    planSelections[oppositeRole] = null;
  }

  if (existingSelection && existingSelection.id !== clinic.id) {
    const shouldReplace = window.confirm(
      `Replace ${existingSelection.name} with ${clinic.name} as your ${capitalize(role)} option?`
    );
    if (!shouldReplace) return;
  }

  planSelections[role] = { ...clinic };
  const action = existingSelection ? "replaced" : "selected";
  refreshSelectionPresentation();
  announceSelection(`${clinic.name} ${action} as your ${capitalize(role)} care-plan option.`);
}

function removeFacilityRole(role) {
  const facility = planSelections[role];
  if (!facility) return;

  planSelections[role] = null;
  refreshSelectionPresentation();
  announceSelection(`${facility.name} removed as your ${capitalize(role)} care-plan option.`);
}

function refreshSelectionPresentation() {
  renderSelectionSummary();
  renderClinics({ preserveView: true });

  if (currentSelectionClinic) {
    updateDetailSelectionControls(currentSelectionClinic);
    const replacementCard = document.querySelector(`[data-clinic-id="${CSS.escape(currentSelectionClinic.id)}"]`);
    if (replacementCard) lastDetailTrigger = replacementCard;
  }
}

function renderSelectionSummary() {
  renderSelectionSlot("primary", planSelections.primary);
  renderSelectionSlot("backup", planSelections.backup);

  const hasSelection = Boolean(planSelections.primary || planSelections.backup);
  selectionElements.summary.classList.toggle("has-selections", hasSelection);
}

function renderSelectionSlot(role, facility) {
  const isPrimary = role === "primary";
  const slot = isPrimary ? selectionElements.primarySlot : selectionElements.backupSlot;
  const name = isPrimary ? selectionElements.primaryName : selectionElements.backupName;
  const meta = isPrimary ? selectionElements.primaryMeta : selectionElements.backupMeta;
  const viewButton = isPrimary ? selectionElements.primaryView : selectionElements.backupView;
  const removeButton = isPrimary ? selectionElements.primaryRemove : selectionElements.backupRemove;

  slot.classList.toggle("is-filled", Boolean(facility));
  slot.classList.toggle(`is-${role}`, Boolean(facility));

  if (!facility) {
    name.textContent = `No ${role} selected`;
    meta.textContent = isPrimary
      ? "Choose a likely emergency or urgent-care facility from the map results."
      : "Choose a distinct backup facility in case the primary option is unavailable.";
    viewButton.hidden = true;
    removeButton.hidden = true;
    return;
  }

  name.textContent = facility.name;
  meta.textContent = `${CARE_TYPE_LABELS[facility.careType] || CARE_TYPE_LABELS.unknown} · ${facility.distanceMiles.toFixed(1)} mi from search`;
  viewButton.hidden = false;
  removeButton.hidden = false;
}

function openSelectionFromSummary(role) {
  const facility = planSelections[role];
  if (!facility) return;

  const trigger = role === "primary" ? selectionElements.primaryView : selectionElements.backupView;
  openFacilityDetail(facility, trigger);
}

function updateDetailSelectionControls(clinic) {
  const role = getFacilityRole(clinic.id);
  const primaryEligible = isPrimaryEligible(clinic);

  selectionElements.detailRoleStatus.textContent = role
    ? `This facility is selected as your ${capitalize(role)} care-plan option.`
    : "This facility has not been added to the care plan yet.";

  configureRoleButton(selectionElements.selectPrimary, "primary", role, primaryEligible);
  configureRoleButton(selectionElements.selectBackup, "backup", role, true);
  selectionElements.detailPlanMessage.textContent = primaryEligible
    ? "Primary and Backup must be different facilities. You can replace or remove either choice at any time."
    : "This listing is not currently classified as emergency or urgent care, so it can be selected as Backup but not Primary.";
  selectionElements.detailPlanMessage.classList.remove("is-error");
}

function configureRoleButton(button, targetRole, currentRole, enabled) {
  const existing = planSelections[targetRole];
  const targetLabel = capitalize(targetRole);

  button.disabled = !enabled && currentRole !== targetRole;
  button.classList.toggle("is-selected-role", currentRole === targetRole);

  if (currentRole === targetRole) {
    button.textContent = `Remove as ${targetLabel}`;
  } else if (!enabled) {
    button.textContent = `${targetLabel} requires emergency or urgent care`;
  } else if (currentRole && currentRole !== targetRole) {
    button.textContent = `Move to ${targetLabel}`;
  } else if (existing) {
    button.textContent = `Replace ${targetLabel}`;
  } else {
    button.textContent = `Select as ${targetLabel}`;
  }
}

function announceSelection(message, isError = false) {
  selectionElements.selectionStatus.textContent = message;
  selectionElements.detailPlanMessage.textContent = message;
  selectionElements.detailPlanMessage.classList.toggle("is-error", isError);
}

function getFacilityRole(id) {
  if (planSelections.primary?.id === id) return "primary";
  if (planSelections.backup?.id === id) return "backup";
  return null;
}

function isPrimaryEligible(clinic) {
  return clinic.careType === "emergency" || clinic.careType === "urgent";
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
