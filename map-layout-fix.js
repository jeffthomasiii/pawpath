/* Keep Leaflet synchronized with responsive layout changes. */

document.addEventListener("DOMContentLoaded", () => {
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
