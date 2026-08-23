/* Load late integration modules after the core care-plan module is available. */

const planSummaryStylesheet = document.createElement("link");
planSummaryStylesheet.rel = "stylesheet";
planSummaryStylesheet.href = "plan-summary.css";
document.head.append(planSummaryStylesheet);

const mobileAppStylesheet = document.createElement("link");
mobileAppStylesheet.rel = "stylesheet";
mobileAppStylesheet.href = "mobile-app.css";
document.head.append(mobileAppStylesheet);

const planSummaryScript = document.createElement("script");
planSummaryScript.src = "plan-summary.js";
planSummaryScript.async = false;
planSummaryScript.addEventListener("load", () => {
  const mobileAppScript = document.createElement("script");
  mobileAppScript.src = "mobile-app.js";
  mobileAppScript.async = false;
  document.head.append(mobileAppScript);
});
document.head.append(planSummaryScript);

/* Keep Leaflet synchronized with responsive layout changes. */

document.addEventListener("DOMContentLoaded", () => {
  const editorClearButton = document.getElementById("clear-care-plan");
  editorClearButton?.addEventListener("click", () => {
    window.setTimeout(() => {
      if (typeof renderSavedPlanSummary === "function") renderSavedPlanSummary();
    }, 0);
  });

  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  let resizeFrame;

  const refreshMap = () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      if (typeof map !== "undefined" && map && typeof map.invalidateSize === "function") {
        map.invalidateSize({ pan: false, debounceMoveend: true });
      }
    });
  };

  refreshMap();
  setTimeout(refreshMap, 150);
  setTimeout(refreshMap, 600);
  window.addEventListener("load", refreshMap, { once: true });
  window.addEventListener("resize", refreshMap, { passive: true });
  window.addEventListener("orientationchange", refreshMap, { passive: true });

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(refreshMap);
    observer.observe(mapElement);
    if (mapElement.parentElement) observer.observe(mapElement.parentElement);
  }
});
