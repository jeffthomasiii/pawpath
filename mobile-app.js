const MOBILE_APP_QUERY = window.matchMedia("(max-width: 700px)");

const originalSetModeForMobileApp = setMode;
let mobileAppElements = {};
let mobileView = activeMode === "now" ? "care" : "plan";
let mobileDiscoveryView = "results";

setMode = function setModeWithMobileApp(mode, announce = false) {
  originalSetModeForMobileApp(mode, announce);
  if (!MOBILE_APP_QUERY.matches || document.body.classList.contains("is-emergency-mode")) return;
  setMobileView(mode === "now" ? "care" : "plan", false);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeMobileAppShell);
} else {
  initializeMobileAppShell();
}

window.addEventListener("storage", (event) => {
  if (event.key === CARE_PLAN_STORAGE_KEY) window.setTimeout(syncMobileSavedPlanState, 0);
});

function initializeMobileAppShell() {
  injectMobileAppHeader();
  injectMobileBottomNavigation();
  injectMobileDiscoverySwitcher();
  injectMobileSavedEmptyState();

  mobileAppElements = {
    header: document.getElementById("mobile-app-header"),
    heading: document.getElementById("mobile-app-title"),
    context: document.getElementById("mobile-app-context"),
    emergency: document.getElementById("mobile-emergency-shortcut"),
    navButtons: [...document.querySelectorAll(".mobile-nav-button[data-mobile-view]")],
    savedDot: document.getElementById("mobile-saved-dot"),
    discoveryButtons: [...document.querySelectorAll(".mobile-discovery-button[data-mobile-discovery]")],
    savedEmpty: document.getElementById("mobile-saved-empty"),
    savedEmptyPlan: document.getElementById("mobile-saved-empty-plan"),
  };

  mobileAppElements.navButtons.forEach((button) => {
    button.addEventListener("click", () => handleMobileNavigation(button.dataset.mobileView));
  });

  mobileAppElements.discoveryButtons.forEach((button) => {
    button.addEventListener("click", () => setMobileDiscoveryView(button.dataset.mobileDiscovery));
  });

  mobileAppElements.emergency.addEventListener("click", () => {
    const openEmergencyButton = document.getElementById("saved-plan-emergency");
    if (openEmergencyButton && !openEmergencyButton.closest("[hidden]")) {
      openEmergencyButton.click();
    }
  });

  mobileAppElements.savedEmptyPlan.addEventListener("click", () => {
    setMode("plan", true);
    setMobileView("plan");
  });

  MOBILE_APP_QUERY.addEventListener?.("change", handleMobileBreakpointChange);

  const appShell = document.getElementById("main-content");
  if (appShell && "MutationObserver" in window) {
    const observer = new MutationObserver(syncMobileSavedPlanState);
    observer.observe(appShell, { childList: true, subtree: false });
  }

  document.addEventListener("click", (event) => {
    const emergencyExit = event.target.closest?.("#emergency-mode-exit");
    if (emergencyExit) window.setTimeout(() => setMobileView("saved", false), 0);
  });

  setMobileDiscoveryView("results", false);
  setMobileView(activeMode === "now" ? "care" : "plan", false);
  syncMobileSavedPlanState();
}

function injectMobileAppHeader() {
  if (document.getElementById("mobile-app-header")) return;
  const header = document.createElement("header");
  header.id = "mobile-app-header";
  header.className = "mobile-app-header";
  header.innerHTML = `
    <div class="mobile-app-brand">
      <img src="assets/PawPath_mark_transparent.png" alt="" aria-hidden="true" />
      <div class="mobile-app-heading">
        <strong id="mobile-app-title">Plan</strong>
        <span id="mobile-app-context">Travel with a care plan</span>
      </div>
    </div>
    <button id="mobile-emergency-shortcut" class="mobile-emergency-shortcut" type="button" hidden>
      Emergency
    </button>
  `;
  document.body.insertBefore(header, document.querySelector(".site-header"));
}

function injectMobileBottomNavigation() {
  if (document.getElementById("mobile-bottom-nav")) return;
  const nav = document.createElement("nav");
  nav.id = "mobile-bottom-nav";
  nav.className = "mobile-bottom-nav";
  nav.setAttribute("aria-label", "PawPath mobile navigation");
  nav.innerHTML = `
    <button class="mobile-nav-button is-active" type="button" data-mobile-view="plan" aria-current="page">
      <span class="mobile-nav-icon" aria-hidden="true">⌖</span>
      <span class="mobile-nav-label">Plan</span>
    </button>
    <button class="mobile-nav-button" type="button" data-mobile-view="care">
      <span class="mobile-nav-icon" aria-hidden="true">✚</span>
      <span class="mobile-nav-label">Care Now</span>
    </button>
    <button class="mobile-nav-button" type="button" data-mobile-view="saved">
      <span class="mobile-nav-icon" aria-hidden="true">✓</span>
      <span class="mobile-nav-label">Saved</span>
      <span id="mobile-saved-dot" class="mobile-nav-dot" hidden aria-hidden="true"></span>
    </button>
  `;
  document.body.append(nav);
}

function injectMobileDiscoverySwitcher() {
  const discovery = document.querySelector(".discovery-layout");
  if (!discovery || document.getElementById("mobile-discovery-switcher")) return;
  const switcher = document.createElement("div");
  switcher.id = "mobile-discovery-switcher";
  switcher.className = "mobile-discovery-switcher";
  switcher.setAttribute("role", "group");
  switcher.setAttribute("aria-label", "Choose care results or map view");
  switcher.innerHTML = `
    <button class="mobile-discovery-button is-active" type="button" data-mobile-discovery="results" aria-pressed="true">Results</button>
    <button class="mobile-discovery-button" type="button" data-mobile-discovery="map" aria-pressed="false">Map</button>
  `;
  discovery.prepend(switcher);
}

function injectMobileSavedEmptyState() {
  if (document.getElementById("mobile-saved-empty")) return;
  const section = document.createElement("section");
  section.id = "mobile-saved-empty";
  section.className = "mobile-saved-empty";
  section.hidden = true;
  section.innerHTML = `
    <span class="mobile-saved-empty-mark" aria-hidden="true">✓</span>
    <h2>No saved care plan yet</h2>
    <p>Choose a Primary and Backup facility and save your trip details. Your plan will stay available here on this device.</p>
    <button id="mobile-saved-empty-plan" class="button button-primary" type="button">Build a care plan</button>
  `;
  const hero = document.getElementById("hero-panel");
  hero?.insertAdjacentElement("afterend", section);
}

function handleMobileNavigation(view) {
  if (!MOBILE_APP_QUERY.matches) return;
  if (document.body.classList.contains("is-emergency-mode") && typeof closeSavedPlanEmergencyMode === "function") {
    closeSavedPlanEmergencyMode(false);
  }

  if (view === "plan") {
    setMode("plan", true);
    setMobileView("plan");
    return;
  }

  if (view === "care") {
    setMode("now", true);
    setMobileView("care");
    return;
  }

  setMobileView("saved");
}

function setMobileView(view, moveFocus = true) {
  if (!["plan", "care", "saved"].includes(view)) return;
  mobileView = view;
  document.body.dataset.mobileView = view;

  mobileAppElements.navButtons?.forEach((button) => {
    const active = button.dataset.mobileView === view;
    button.classList.toggle("is-active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });

  const labels = {
    plan: ["Plan", "Prepare before you leave"],
    care: ["Care Now", "Find nearby veterinary care"],
    saved: ["Saved Plan", "Your Primary and Backup"],
  };
  if (mobileAppElements.heading) mobileAppElements.heading.textContent = labels[view][0];
  if (mobileAppElements.context) mobileAppElements.context.textContent = labels[view][1];

  syncMobileSavedPlanState();
  if (view !== "saved") setMobileDiscoveryView("results", false);

  if (view === "saved" && moveFocus) {
    window.setTimeout(() => {
      const target = document.getElementById("saved-plan-emergency") || document.getElementById("mobile-saved-empty-plan");
      target?.focus({ preventScroll: true });
    }, 0);
  }

  window.scrollTo({ top: 0, behavior: prefersReducedMotion?.() ? "auto" : "smooth" });
}

function setMobileDiscoveryView(view, moveFocus = false) {
  if (!["results", "map"].includes(view)) return;
  mobileDiscoveryView = view;
  document.body.dataset.mobileDiscovery = view;

  mobileAppElements.discoveryButtons?.forEach((button) => {
    const active = button.dataset.mobileDiscovery === view;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  if (view === "map") {
    window.setTimeout(() => {
      if (typeof map !== "undefined" && map?.invalidateSize) map.invalidateSize({ pan: false });
    }, 80);
  }

  if (moveFocus) {
    const panel = view === "results" ? document.querySelector(".results-panel") : document.getElementById("map");
    panel?.focus?.({ preventScroll: true });
  }
}

function syncMobileSavedPlanState() {
  if (!mobileAppElements.savedEmpty) return;
  const savedRegion = document.getElementById("saved-plan-summary");
  const hasPlan = Boolean(typeof hasSavedCarePlan !== "undefined" && hasSavedCarePlan && activeStoredPlan);

  mobileAppElements.savedEmpty.hidden = hasPlan;
  if (mobileAppElements.savedDot) mobileAppElements.savedDot.hidden = !hasPlan;
  if (mobileAppElements.emergency) mobileAppElements.emergency.hidden = !hasPlan;

  if (savedRegion && mobileView === "saved") {
    savedRegion.hidden = !hasPlan;
  }
}

function handleMobileBreakpointChange(event) {
  if (event.matches) {
    setMobileView(activeMode === "now" ? "care" : "plan", false);
    setMobileDiscoveryView(mobileDiscoveryView, false);
    syncMobileSavedPlanState();
    return;
  }

  document.body.removeAttribute("data-mobile-view");
  document.body.removeAttribute("data-mobile-discovery");
  const savedRegion = document.getElementById("saved-plan-summary");
  if (savedRegion && typeof hasSavedCarePlan !== "undefined") savedRegion.hidden = !hasSavedCarePlan;
}
