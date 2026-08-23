const MOBILE_PLAN_QUERY = window.matchMedia("(max-width: 700px)");

let mobilePlanStep = "trip";
let mobilePlanElements = {};
const originalSetMobileViewForPlanStepper = setMobileView;

setMobileView = function setMobileViewWithPlanStepper(view, moveFocus = true) {
  originalSetMobileViewForPlanStepper(view, moveFocus);
  if (!MOBILE_PLAN_QUERY.matches || view !== "plan") return;
  const preferredStep = hasSavedCarePlan && activeStoredPlan ? "review" : mobilePlanStep;
  setMobilePlanStep(preferredStep, false);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeMobilePlanStepper);
} else {
  initializeMobilePlanStepper();
}

function initializeMobilePlanStepper() {
  injectMobilePlanStepper();
  injectMobilePlanReview();
  injectMobilePlanContinueActions();

  mobilePlanElements = {
    shell: document.getElementById("mobile-plan-stepper"),
    progress: document.getElementById("mobile-plan-progress"),
    buttons: [...document.querySelectorAll(".mobile-plan-step-button[data-plan-step]")],
    tripSummary: document.getElementById("mobile-plan-trip-summary"),
    careSummary: document.getElementById("mobile-plan-care-summary"),
    reviewSummary: document.getElementById("mobile-plan-review-summary"),
    tripContinue: document.getElementById("mobile-plan-trip-continue"),
    careContinue: document.getElementById("mobile-plan-care-continue"),
    review: document.getElementById("mobile-plan-review"),
    reviewTrip: document.getElementById("mobile-plan-review-trip"),
    reviewPrimary: document.getElementById("mobile-plan-review-primary"),
    reviewBackup: document.getElementById("mobile-plan-review-backup"),
    reviewEditTrip: document.getElementById("mobile-plan-review-edit-trip"),
    reviewEditCare: document.getElementById("mobile-plan-review-edit-care"),
    reviewSave: document.getElementById("mobile-plan-review-save"),
    status: document.getElementById("mobile-plan-step-status"),
  };

  mobilePlanElements.buttons.forEach((button) => {
    button.addEventListener("click", () => setMobilePlanStep(button.dataset.planStep));
  });
  mobilePlanElements.tripContinue.addEventListener("click", continueFromTripStep);
  mobilePlanElements.careContinue.addEventListener("click", continueFromCareStep);
  mobilePlanElements.reviewEditTrip.addEventListener("click", () => setMobilePlanStep("trip"));
  mobilePlanElements.reviewEditCare.addEventListener("click", () => setMobilePlanStep("care"));
  mobilePlanElements.reviewSave.addEventListener("click", () => {
    document.getElementById("save-care-plan")?.click();
    window.setTimeout(syncMobilePlanStepper, 0);
  });

  document.getElementById("care-plan-form")?.addEventListener("input", syncMobilePlanStepper);
  document.getElementById("care-plan-form")?.addEventListener("change", syncMobilePlanStepper);
  document.addEventListener("click", (event) => {
    if (event.target.closest?.("[data-selection-action], .plan-role-button, #primary-selection-remove, #backup-selection-remove")) {
      window.setTimeout(syncMobilePlanStepper, 0);
    }
  });
  window.addEventListener("storage", (event) => {
    if (event.key === CARE_PLAN_STORAGE_KEY) window.setTimeout(syncMobilePlanStepper, 0);
  });

  MOBILE_PLAN_QUERY.addEventListener?.("change", () => {
    if (MOBILE_PLAN_QUERY.matches && mobileView === "plan") setMobilePlanStep(mobilePlanStep, false);
  });

  setMobilePlanStep(hasSavedCarePlan && activeStoredPlan ? "review" : "trip", false);
  syncMobilePlanStepper();
}

function injectMobilePlanStepper() {
  if (document.getElementById("mobile-plan-stepper")) return;
  const shell = document.createElement("section");
  shell.id = "mobile-plan-stepper";
  shell.className = "mobile-plan-stepper";
  shell.setAttribute("aria-label", "Care plan progress");
  shell.innerHTML = `
    <div class="mobile-plan-progress-row">
      <div>
        <p class="eyebrow">Build your care plan</p>
        <strong id="mobile-plan-progress">Step 1 of 3</strong>
      </div>
      <span class="mobile-plan-progress-track" aria-hidden="true"><span></span></span>
    </div>
    <div class="mobile-plan-steps">
      <button class="mobile-plan-step-button is-active" type="button" data-plan-step="trip" aria-expanded="true">
        <span class="mobile-plan-step-number">1</span>
        <span class="mobile-plan-step-copy"><strong>Trip & pet</strong><small id="mobile-plan-trip-summary">Add trip details</small></span>
      </button>
      <button class="mobile-plan-step-button" type="button" data-plan-step="care" aria-expanded="false">
        <span class="mobile-plan-step-number">2</span>
        <span class="mobile-plan-step-copy"><strong>Choose care</strong><small id="mobile-plan-care-summary">Primary and Backup needed</small></span>
      </button>
      <button class="mobile-plan-step-button" type="button" data-plan-step="review" aria-expanded="false">
        <span class="mobile-plan-step-number">3</span>
        <span class="mobile-plan-step-copy"><strong>Review & save</strong><small id="mobile-plan-review-summary">Finish earlier steps first</small></span>
      </button>
    </div>
    <p id="mobile-plan-step-status" class="sr-only" role="status" aria-live="polite"></p>
  `;
  document.getElementById("hero-panel")?.insertAdjacentElement("beforebegin", shell);
}

function injectMobilePlanContinueActions() {
  if (!document.getElementById("mobile-plan-trip-continue")) {
    const tripActions = document.createElement("div");
    tripActions.className = "mobile-plan-stage-actions";
    tripActions.innerHTML = `<button id="mobile-plan-trip-continue" class="button button-primary" type="button">Continue to care options</button>`;
    document.getElementById("care-plan-editor")?.append(tripActions);
  }

  if (!document.getElementById("mobile-plan-care-continue")) {
    const careActions = document.createElement("div");
    careActions.className = "mobile-plan-stage-actions mobile-plan-care-actions";
    careActions.innerHTML = `<button id="mobile-plan-care-continue" class="button button-primary" type="button">Review plan</button>`;
    document.getElementById("care-plan-selection")?.append(careActions);
  }
}

function injectMobilePlanReview() {
  if (document.getElementById("mobile-plan-review")) return;
  const review = document.createElement("section");
  review.id = "mobile-plan-review";
  review.className = "mobile-plan-review";
  review.hidden = true;
  review.innerHTML = `
    <div class="mobile-plan-review-heading">
      <p class="eyebrow">Review & save</p>
      <h2>Your trip care plan</h2>
      <p>Confirm the details below before saving this plan to your device.</p>
    </div>
    <article class="mobile-plan-review-card">
      <div class="mobile-plan-review-card-heading"><strong>Trip & pet</strong><button id="mobile-plan-review-edit-trip" class="text-button" type="button">Edit</button></div>
      <div id="mobile-plan-review-trip" class="mobile-plan-review-details"></div>
    </article>
    <article class="mobile-plan-review-card">
      <div class="mobile-plan-review-card-heading"><strong>Care choices</strong><button id="mobile-plan-review-edit-care" class="text-button" type="button">Edit</button></div>
      <div class="mobile-plan-review-facilities">
        <div><span class="selection-role-label is-primary">Primary</span><strong id="mobile-plan-review-primary">Not selected</strong></div>
        <div><span class="selection-role-label is-backup">Backup</span><strong id="mobile-plan-review-backup">Not selected</strong></div>
      </div>
    </article>
    <p class="mobile-plan-review-note">Call ahead to confirm services, hours, and availability before relying on a facility.</p>
    <button id="mobile-plan-review-save" class="button button-primary mobile-plan-review-save" type="button">Save care plan</button>
  `;
  document.getElementById("care-plan-selection")?.insertAdjacentElement("afterend", review);
}

function setMobilePlanStep(step, moveFocus = true) {
  if (!["trip", "care", "review"].includes(step)) return;
  mobilePlanStep = step;
  document.body.dataset.mobilePlanStep = step;

  mobilePlanElements.buttons?.forEach((button) => {
    const active = button.dataset.planStep === step;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-expanded", String(active));
  });

  const stepIndex = { trip: 1, care: 2, review: 3 }[step];
  if (mobilePlanElements.progress) mobilePlanElements.progress.textContent = `Step ${stepIndex} of 3`;
  document.documentElement.style.setProperty("--mobile-plan-progress", `${stepIndex * 33.333}%`);
  syncMobilePlanStepper();

  if (step === "care") setMobileDiscoveryView("results", false);
  if (moveFocus) {
    const target = step === "trip"
      ? document.getElementById("trip-name")
      : step === "care"
        ? document.getElementById("care-plan-selection-title")
        : document.querySelector("#mobile-plan-review h2");
    window.setTimeout(() => target?.focus?.({ preventScroll: true }), 0);
  }
  window.scrollTo({ top: 0, behavior: prefersReducedMotion?.() ? "auto" : "smooth" });
}

function continueFromTripStep() {
  const issue = validateMobileTripStage();
  if (issue) {
    announceMobilePlanStep(issue.message);
    issue.element?.focus();
    return;
  }
  setMobilePlanStep("care");
  announceMobilePlanStep("Trip details complete. Choose a Primary and Backup facility.");
}

function continueFromCareStep() {
  if (!planSelections.primary || !planSelections.backup) {
    announceMobilePlanStep("Choose both a Primary and a distinct Backup facility before reviewing your plan.");
    return;
  }
  setMobilePlanStep("review");
  announceMobilePlanStep("Care choices complete. Review your plan before saving.");
}

function validateMobileTripStage() {
  const name = document.getElementById("trip-name");
  const destination = document.getElementById("trip-destination");
  const start = document.getElementById("trip-start-date");
  const end = document.getElementById("trip-end-date");
  if (!name?.value.trim()) return { message: "Add a trip name before continuing.", element: name };
  if (!destination?.value.trim()) return { message: "Add a destination before continuing.", element: destination };
  if (start?.value && end?.value && end.value < start.value) return { message: "The trip end date cannot be before the start date.", element: end };
  return null;
}

function syncMobilePlanStepper() {
  if (!mobilePlanElements.shell) return;
  const name = document.getElementById("trip-name")?.value.trim() || "";
  const destination = document.getElementById("trip-destination")?.value.trim() || "";
  const pet = document.getElementById("pet-name")?.value.trim() || "";
  const tripReady = !validateMobileTripStage();
  const careReady = Boolean(planSelections.primary && planSelections.backup);

  if (mobilePlanElements.tripSummary) {
    mobilePlanElements.tripSummary.textContent = tripReady
      ? [name, pet || destination].filter(Boolean).join(" · ")
      : "Add trip details";
  }
  if (mobilePlanElements.careSummary) {
    mobilePlanElements.careSummary.textContent = careReady
      ? `${planSelections.primary.name} · Backup ready`
      : planSelections.primary
        ? "Primary selected · Backup needed"
        : "Primary and Backup needed";
  }
  if (mobilePlanElements.reviewSummary) {
    mobilePlanElements.reviewSummary.textContent = tripReady && careReady ? "Ready to review" : "Finish earlier steps first";
  }

  mobilePlanElements.buttons?.forEach((button) => {
    const step = button.dataset.planStep;
    button.classList.toggle("is-complete", step === "trip" ? tripReady : step === "care" ? careReady : hasSavedCarePlan);
  });

  if (mobilePlanElements.reviewTrip) {
    const dates = formatMobilePlanDates(
      document.getElementById("trip-start-date")?.value || "",
      document.getElementById("trip-end-date")?.value || ""
    );
    mobilePlanElements.reviewTrip.innerHTML = [
      ["Trip", name || "Not added"],
      ["Destination", destination || "Not added"],
      ["Dates", dates],
      ["Pet", pet || "Not added"],
      ["Owner phone", document.getElementById("owner-phone")?.value.trim() || "Not added"],
      ["Important note", document.getElementById("pet-note")?.value.trim() || "No note added"],
    ].map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
  }
  if (mobilePlanElements.reviewPrimary) mobilePlanElements.reviewPrimary.textContent = planSelections.primary?.name || "Not selected";
  if (mobilePlanElements.reviewBackup) mobilePlanElements.reviewBackup.textContent = planSelections.backup?.name || "Not selected";
  if (mobilePlanElements.reviewSave) {
    mobilePlanElements.reviewSave.disabled = !(tripReady && careReady);
    mobilePlanElements.reviewSave.textContent = hasSavedCarePlan ? "Update care plan" : "Save care plan";
  }
}

function announceMobilePlanStep(message) {
  if (!mobilePlanElements.status) return;
  mobilePlanElements.status.textContent = "";
  window.requestAnimationFrame(() => { mobilePlanElements.status.textContent = message; });
}

function formatMobilePlanDates(start, end) {
  if (!start && !end) return "Not added";
  if (start && !end) return `Starts ${formatMobilePlanDate(start)}`;
  if (!start && end) return `Ends ${formatMobilePlanDate(end)}`;
  return `${formatMobilePlanDate(start)} – ${formatMobilePlanDate(end)}`;
}

function formatMobilePlanDate(value) {
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}
