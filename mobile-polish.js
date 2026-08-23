/* Keep mobile discovery controls from reopening at a retained inner-scroll position. */

const MOBILE_POLISH_QUERY = window.matchMedia("(max-width: 700px)");
let mobileFallbackNoticeVisible = false;

function resetMobileResultsScroll() {
  if (!MOBILE_POLISH_QUERY.matches) return;
  const resultsPanel = document.querySelector(".results-panel");
  if (!resultsPanel) return;
  resultsPanel.scrollTo({ top: 0, behavior: "auto" });
}

function scheduleMobileResultsReset() {
  window.requestAnimationFrame(() => {
    resetMobileResultsScroll();
    window.setTimeout(resetMobileResultsScroll, 80);
  });
}

function syncMobileFallbackNoticeState() {
  const notice = document.getElementById("expanded-emergency-search-notice");
  const isVisible = Boolean(notice && !notice.hidden);

  if (isVisible && !mobileFallbackNoticeVisible) {
    scheduleMobileResultsReset();
  }

  mobileFallbackNoticeVisible = isVisible;
}

function observeMobileFallbackNotice() {
  const resultsPanel = document.querySelector(".results-panel");
  if (!resultsPanel || !("MutationObserver" in window)) return;

  const observer = new MutationObserver(syncMobileFallbackNoticeState);
  observer.observe(resultsPanel, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["hidden"],
  });

  syncMobileFallbackNoticeState();
}

document.addEventListener("click", (event) => {
  const mobileNav = event.target.closest?.(".mobile-nav-button[data-mobile-view]");
  if (mobileNav?.dataset.mobileView === "care") scheduleMobileResultsReset();

  const discoveryButton = event.target.closest?.(".mobile-discovery-button[data-mobile-discovery]");
  if (discoveryButton?.dataset.mobileDiscovery === "results") scheduleMobileResultsReset();

  const planStep = event.target.closest?.(".mobile-plan-step-button[data-plan-step]");
  if (planStep?.dataset.planStep === "care") scheduleMobileResultsReset();

  if (event.target.closest?.("#mobile-plan-trip-continue")) scheduleMobileResultsReset();
});

MOBILE_POLISH_QUERY.addEventListener?.("change", (event) => {
  if (event.matches) scheduleMobileResultsReset();
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", observeMobileFallbackNotice);
} else {
  observeMobileFallbackNotice();
}
