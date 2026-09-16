/* Mockup-first PawPath application shell.
 * Progressive enhancement: existing controls remain the source of truth.
 */

(() => {
  const desktopMedia = window.matchMedia("(min-width: 701px)");
  let modeObserver;

  function clickMode(mode) {
    document.querySelector(`.mode-option[data-mode="${mode}"]`)?.click();
  }

  function scrollToTarget(selector) {
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function buildMockupShell() {
    if (document.querySelector(".mockup-home")) return;
    const main = document.getElementById("main-content");
    const header = document.querySelector(".site-header");
    if (!main || !header) return;

    header.classList.add("mockup-site-header");
    const headerActions = header.querySelector(".site-header-actions");
    if (headerActions) {
      headerActions.innerHTML = `
        <nav class="mockup-top-nav" aria-label="Primary navigation">
          <button type="button" data-shell-action="plan">Plan a Trip</button>
          <button type="button" data-shell-action="now">Find Care Now</button>
          <button type="button" data-shell-action="saved">Saved Plan</button>
        </nav>
        <button class="mockup-menu" type="button" aria-label="More PawPath options">☰</button>
      `;
    }

    const shell = document.createElement("section");
    shell.className = "mockup-home";
    shell.setAttribute("aria-label", "PawPath trip preparedness");
    shell.innerHTML = `
      <div class="mockup-hero">
        <div class="mockup-hero-copy">
          <p class="mockup-kicker">Prepared pets. Brighter adventures.</p>
          <h1>Travel Further<br>Together</h1>
          <p class="mockup-lede">Plan ahead. Find pet care. Explore with confidence.</p>
          <div class="mockup-hero-actions">
            <button class="mockup-cta mockup-cta-primary" type="button" data-shell-action="plan">Plan a Trip <span>→</span></button>
            <button class="mockup-cta mockup-cta-secondary" type="button" data-shell-action="now"><span>●</span> Find Care Now</button>
          </div>
        </div>
        <div class="mockup-hero-art" aria-hidden="true">
          <div class="mockup-sun"></div>
          <div class="mockup-mountain mockup-mountain-back"></div>
          <div class="mockup-mountain mockup-mountain-front"></div>
          <div class="mockup-trail"></div>
          <div class="mockup-pet-medallion">🐾</div>
          <p>Good trips<br>include them.</p>
        </div>
      </div>

      <div class="mockup-quick-grid" aria-label="PawPath quick actions">
        <button type="button" data-shell-action="plan"><span class="mockup-quick-icon">⌖</span><span><strong>Plan Ahead</strong><small>Find and save care options for your trip</small></span><b>›</b></button>
        <button type="button" data-shell-action="now"><span class="mockup-quick-icon">●</span><span><strong>Find Care Now</strong><small>Nearby veterinary care when you need it</small></span><b>›</b></button>
        <button type="button" data-shell-action="saved"><span class="mockup-quick-icon">▣</span><span><strong>Saved Plan</strong><small>Keep your trip care details handy</small></span><b>›</b></button>
        <button type="button" data-shell-action="emergency"><span class="mockup-quick-icon">♥</span><span><strong>Emergency Ready</strong><small>Primary and backup, ready to act on</small></span><b>›</b></button>
      </div>

      <div class="mockup-prep-strip">
        <div><span>01</span><strong>Choose a destination</strong><small>Start with where you're staying.</small></div>
        <div><span>02</span><strong>Compare nearby care</strong><small>Review details and call ahead.</small></div>
        <div><span>03</span><strong>Save Primary + Backup</strong><small>Reduce decisions if something goes wrong.</small></div>
      </div>
    `;
    main.insertAdjacentElement("beforebegin", shell);

    document.body.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-shell-action]");
      if (!trigger) return;
      const action = trigger.dataset.shellAction;
      if (action === "plan") {
        clickMode("plan");
        scrollToTarget("#hero-panel");
      } else if (action === "now") {
        clickMode("now");
        scrollToTarget("#hero-panel");
      } else if (action === "saved") {
        document.querySelector('[data-mobile-nav="saved"]')?.click();
        scrollToTarget("#care-plan-editor");
      } else if (action === "emergency") {
        document.querySelector('[data-mobile-nav="emergency"]')?.click();
        scrollToTarget("#care-plan-selection");
      }
    });
  }

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

  document.addEventListener("DOMContentLoaded", () => {
    buildMockupShell();
    buildJourney();
  });
  desktopMedia.addEventListener?.("change", buildJourney);
})();
