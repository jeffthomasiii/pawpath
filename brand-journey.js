/* Premium mockup-faithful PawPath application shell.
 * Existing application controls remain the behavioral source of truth.
 */
(() => {
  const desktopMedia = window.matchMedia("(min-width: 701px)");
  let modeObserver;
  const icon = (name) => {
    const paths = {
      plan: '<path d="M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1Z"/><path d="m9 15 2 2 4-5"/>',
      pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
      saved: '<path d="M5 4h14v17l-7-4-7 4V4Z"/><path d="M9 8h6"/>',
      alert: '<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v5M12 17.5v.1"/>',
      search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
      paw: '<ellipse cx="12" cy="15.5" rx="5" ry="4"/><circle cx="6.5" cy="10" r="2"/><circle cx="10" cy="6.5" r="2"/><circle cx="14" cy="6.5" r="2"/><circle cx="17.5" cy="10" r="2"/>',
      arrow: '<path d="M5 12h14M14 7l5 5-5 5"/>',
      user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c.7-4 3.3-6 8-6s7.3 2 8 6"/>'
    };
    return `<svg class="pp-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.paw}</svg>`;
  };
  function clickMode(mode) { document.querySelector(`.mode-option[data-mode="${mode}"]`)?.click(); }
  function scrollToTarget(selector) { document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "start" }); }

  function buildMockupShell() {
    if (document.querySelector(".mockup-home")) return;
    const main = document.getElementById("main-content");
    const header = document.querySelector(".site-header");
    if (!main || !header) return;
    header.classList.add("mockup-site-header");
    const headerActions = header.querySelector(".site-header-actions");
    if (headerActions) headerActions.innerHTML = `<nav class="mockup-top-nav" aria-label="Primary navigation"><button type="button" data-shell-action="plan">Plan a Trip</button><button type="button" data-shell-action="now">Find Care Now</button><button type="button" data-shell-action="saved">Saved Plans</button><button type="button" data-shell-action="resources">Resources</button></nav><button class="mockup-account" type="button" aria-label="Profile">${icon('user')}</button><button class="mockup-menu" type="button" aria-label="More PawPath options"><span></span><span></span><span></span></button>`;

    const shell = document.createElement("section");
    shell.className = "mockup-home";
    shell.setAttribute("aria-label", "PawPath trip preparedness");
    shell.innerHTML = `
      <section class="mockup-hero">
        <div class="mockup-hero-shade"></div>
        <div class="mockup-hero-copy">
          <p class="mockup-kicker">Prepared pets. Brighter adventures.</p>
          <h1>Travel Further<br>Together</h1>
          <p class="mockup-lede">Plan ahead. Find pet care. Explore with confidence.</p>
          <div class="mockup-hero-actions"><button class="mockup-cta mockup-cta-primary" type="button" data-shell-action="plan">Plan a Trip ${icon('arrow')}</button><button class="mockup-cta mockup-cta-secondary" type="button" data-shell-action="now">${icon('pin')} Find Care Now</button></div>
        </div>
        <div class="mockup-hero-note" aria-hidden="true">Good trips<br>include them.<span>${icon('paw')}</span></div>
        <p class="mockup-photo-credit">Photo: Royce Fonseca / Unsplash</p>
      </section>
      <div class="mockup-quick-grid" aria-label="PawPath quick actions">
        <button type="button" data-shell-action="plan"><span class="mockup-quick-icon">${icon('plan')}</span><span><strong>Plan Ahead</strong><small>Find and save care options for your trip.</small></span>${icon('arrow')}</button>
        <button type="button" data-shell-action="now"><span class="mockup-quick-icon">${icon('pin')}</span><span><strong>Find Care Now</strong><small>Nearby veterinary care when you need it.</small></span>${icon('arrow')}</button>
        <button type="button" data-shell-action="saved"><span class="mockup-quick-icon">${icon('saved')}</span><span><strong>Saved Plans</strong><small>Keep your pet care details handy.</small></span>${icon('arrow')}</button>
        <button type="button" data-shell-action="emergency"><span class="mockup-quick-icon">${icon('alert')}</span><span><strong>Emergency Ready</strong><small>Primary and backup, ready to act on.</small></span>${icon('arrow')}</button>
      </div>
      <section class="mockup-dashboard">
        <article class="mockup-destination-card"><p class="mockup-kicker">Plan your next adventure</p><h2>Where are you going?</h2><button type="button" data-shell-action="plan">${icon('search')} <span>Campground, city, state, or ZIP code…</span><b>Explore</b></button><div class="mockup-recent"><span>Start with your destination</span><span>Compare nearby care</span><span>Save two options</span></div></article>
        <article class="mockup-feature-card"><div class="mockup-feature-copy"><span>Adventure ready</span><h2>Plan before<br>you pull out.</h2><p>Know where to call and where to go before your pet needs care.</p><button type="button" data-shell-action="plan">Build your care plan ${icon('arrow')}</button></div><p class="mockup-photo-credit">Photo: Fabio Sasso / Unsplash</p></article>
      </section>
    `;
    main.insertAdjacentElement("beforebegin", shell);

    document.body.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-shell-action]"); if (!trigger) return;
      const action = trigger.dataset.shellAction;
      if (action === "plan") { clickMode("plan"); scrollToTarget("#hero-panel"); }
      else if (action === "now") { clickMode("now"); scrollToTarget("#hero-panel"); }
      else if (action === "saved") { document.querySelector('[data-mobile-nav="saved"]')?.click(); scrollToTarget("#care-plan-editor"); }
      else if (action === "emergency") { document.querySelector('[data-mobile-nav="emergency"]')?.click(); scrollToTarget("#care-plan-selection"); }
      else if (action === "resources") { window.location.href = "docs/?v=20260716-1"; }
    });
  }

  function syncJourneyVisibility(hero, journey) { journey.hidden = !(desktopMedia.matches && hero.dataset.mode === "plan"); }
  function buildJourney() {
    const hero=document.getElementById("hero-panel"), editor=document.getElementById("care-plan-editor"), selection=document.getElementById("care-plan-selection"), discovery=document.querySelector(".discovery-layout");
    if(!hero||!editor||!selection||!discovery)return;
    let journey=document.querySelector(".desktop-plan-journey");
    if(!journey){journey=document.createElement("nav");journey.className="desktop-plan-journey";journey.setAttribute("aria-label","Care plan steps");journey.innerHTML=`<button type="button" data-journey-target="care-plan-editor"><span>1</span><strong>Trip details</strong><small>Dates, destination & pet</small></button><button type="button" data-journey-target="discovery"><span>2</span><strong>Explore care</strong><small>Compare nearby options</small></button><button type="button" data-journey-target="care-plan-selection"><span>3</span><strong>Primary & backup</strong><small>Build your care plan</small></button>`;hero.insertAdjacentElement("afterend",journey);journey.addEventListener("click",e=>{const b=e.target.closest("button[data-journey-target]");if(!b)return;const t=b.dataset.journeyTarget==="discovery"?discovery:document.getElementById(b.dataset.journeyTarget);t?.scrollIntoView({behavior:"smooth",block:"start"});});}
    syncJourneyVisibility(hero,journey);if(!modeObserver&&"MutationObserver"in window){modeObserver=new MutationObserver(()=>syncJourneyVisibility(hero,journey));modeObserver.observe(hero,{attributes:true,attributeFilter:["data-mode"]});}
  }
  document.addEventListener("DOMContentLoaded",()=>{buildMockupShell();buildJourney();}); desktopMedia.addEventListener?.("change",buildJourney);
})();