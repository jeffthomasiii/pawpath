/* Desktop-only journey navigation for the structural brand refresh.
 * Progressive enhancement: existing sections and IDs remain the source of truth.
 */

(() => {
  const desktopMedia = window.matchMedia("(min-width: 701px)");
  let modeObserver;

  function syncJourneyVisibility(hero, journey) {
    const shouldShow = desktopMedia.matches && hero.dataset.mode === "plan";
    journey.hidden = !shouldShow;
  }

  function buildJourney() {
    const hero = document.getElementById("hero-panel");
    const editor = document.getElementById("care-plan-editor");
    const selection = document.getElementById("care-plan-selection");
    const discovery = document.querySelector(".discovery-layout");
    if (!hero || !editor || !selection || !discovery) return;

    let journey = document.querySelector(".desktop-plan-journey");
    if (!journey) {
      journey = document.createElement("nav");
      journey.className = "desktop-plan-journey";
      journey.setAttribute("aria-label", "Care plan steps");
      journey.innerHTML = `
        <button type="button" data-journey-target="care-plan-editor"><span>1</span><strong>Trip details</strong><small>Dates, destination & pet</small></button>
        <button type="button" data-journey-target="discovery"><span>2</span><strong>Explore care</strong><small>Compare nearby options</small></button>
        <button type="button" data-journey-target="care-plan-selection"><span>3</span><strong>Primary & backup</strong><small>Build your care plan</small></button>
      `;
      hero.insertAdjacentElement("afterend", journey);

      journey.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-journey-target]");
        if (!button) return;
        const targetName = button.dataset.journeyTarget;
        const target = targetName === "discovery" ? discovery : document.getElementById(targetName);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    syncJourneyVisibility(hero, journey);

    if (!modeObserver && "MutationObserver" in window) {
      modeObserver = new MutationObserver(() => syncJourneyVisibility(hero, journey));
      modeObserver.observe(hero, { attributes: true, attributeFilter: ["data-mode"] });
    }
  }

  document.addEventListener("DOMContentLoaded", buildJourney);
  desktopMedia.addEventListener?.("change", buildJourney);
})();
