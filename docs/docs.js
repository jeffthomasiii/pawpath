(() => {
  "use strict";

  const repositoryDocsUrl = "https://github.com/jeffthomasiii/pawpath/blob/main/docs/";
  const documents = [
    {
      slug: "why-pawpath",
      file: "WHY_PAWPATH.md",
      title: "Why PawPath?",
      eyebrow: "Product distinction",
      description: "The problem PawPath solves, who it serves, and why the outcome must be a care plan rather than a list of places."
    },
    {
      slug: "product-vision",
      file: "PRODUCT_VISION.md",
      title: "Product Vision",
      eyebrow: "Direction",
      description: "Mission, jobs to be done, core experiences, trust principles, success criteria, and long-term opportunity."
    },
    {
      slug: "brand-guide",
      file: "BRAND_GUIDE.md",
      title: "Brand Guide",
      eyebrow: "Brand source",
      description: "The durable voice, visual, interaction, accessibility, and product-decision guidance for PawPath."
    },
    {
      slug: "poc-scope",
      file: "POC_SCOPE.md",
      title: "Proof-of-Concept Scope",
      eyebrow: "Requirements",
      description: "The complete v0.2 demonstration outcome, required capabilities, acceptance criteria, and explicit non-goals."
    },
    {
      slug: "roadmap",
      file: "ROADMAP.md",
      title: "Roadmap",
      eyebrow: "Product phases",
      description: "The phased path from a care-plan proof of concept to stronger trust, route planning, offline readiness, and a broader platform."
    },
    {
      slug: "backlog",
      file: "BACKLOG.md",
      title: "Phase 1 Backlog",
      eyebrow: "Work packages",
      description: "The implementation sequence and release gate for POC-01 through POC-09."
    },
    {
      slug: "implementation-notes",
      file: "IMPLEMENTATION_NOTES.md",
      title: "Implementation Notes",
      eyebrow: "Technical guidance",
      description: "Practical architecture, state, storage, data-confidence, accessibility, and definition-of-done guidance for the static application."
    },
    {
      slug: "demo-script",
      file: "DEMO_SCRIPT.md",
      title: "Demo Script",
      eyebrow: "Product story",
      description: "A focused walkthrough and feedback guide for proving that viewers understand the PawPath distinction."
    }
  ];

  const home = document.querySelector("#docs-home");
  const documentView = document.querySelector("#document-view");
  const documentTitle = document.querySelector("#document-title");
  const documentEyebrow = document.querySelector("#document-eyebrow");
  const documentDescription = document.querySelector("#document-description");
  const documentStatus = document.querySelector("#document-status");
  const markdownContent = document.querySelector("#markdown-content");
  const sourceLink = document.querySelector("#document-source-link");
  const previousLink = document.querySelector("#previous-document");
  const nextLink = document.querySelector("#next-document");
  const homeLinks = document.querySelectorAll("[data-home-link]");
  let renderRequest = 0;

  const findDocumentByHash = () => {
    const slug = window.location.hash.replace(/^#/, "").trim();
    return documents.find((document) => document.slug === slug) || null;
  };

  const setHomeView = () => {
    renderRequest += 1;
    home.hidden = false;
    documentView.hidden = true;
    document.body.classList.remove("document-open");
    document.title = "PawPath Documentation";
  };

  const configurePager = (doc) => {
    const index = documents.findIndex((item) => item.slug === doc.slug);
    const previous = documents[index - 1] || null;
    const next = documents[index + 1] || null;

    previousLink.hidden = !previous;
    nextLink.hidden = !next;

    if (previous) {
      previousLink.href = `#${previous.slug}`;
      previousLink.textContent = `← ${previous.title}`;
    }

    if (next) {
      nextLink.href = `#${next.slug}`;
      nextLink.textContent = `${next.title} →`;
    }
  };

  const makeRenderedLinksSafe = () => {
    markdownContent.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href") || "";
      const matchingDocument = documents.find((document) => href.endsWith(document.file));

      if (matchingDocument) {
        link.setAttribute("href", `#${matchingDocument.slug}`);
        return;
      }

      if (/^https?:\/\//i.test(href)) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    });
  };

  const renderDocument = async (doc) => {
    const requestId = ++renderRequest;
    home.hidden = true;
    documentView.hidden = false;
    document.body.classList.add("document-open");

    documentTitle.textContent = doc.title;
    documentEyebrow.textContent = doc.eyebrow;
    documentDescription.textContent = doc.description;
    sourceLink.href = `${repositoryDocsUrl}${doc.file}`;
    documentStatus.hidden = false;
    documentStatus.classList.remove("is-error");
    documentStatus.textContent = "Loading document…";
    markdownContent.replaceChildren();
    configurePager(doc);
    window.document.title = `${doc.title} | PawPath Documentation`;

    window.scrollTo({ top: 0, behavior: "auto" });

    try {
      if (!window.marked || !window.DOMPurify) {
        throw new Error("The document renderer did not load.");
      }

      const response = await fetch(doc.file, { cache: "no-cache" });
      if (!response.ok) {
        throw new Error(`Document request failed with status ${response.status}.`);
      }

      const markdown = await response.text();
      if (requestId !== renderRequest) return;

      const rendered = window.marked.parse(markdown, { gfm: true });
      markdownContent.innerHTML = window.DOMPurify.sanitize(rendered, { USE_PROFILES: { html: true } });

      const firstHeading = markdownContent.querySelector("h1");
      if (firstHeading && firstHeading.textContent.trim().toLowerCase() === doc.title.toLowerCase()) {
        firstHeading.remove();
      }

      makeRenderedLinksSafe();
      documentStatus.hidden = true;
      documentTitle.focus?.();
    } catch (error) {
      if (requestId !== renderRequest) return;
      documentStatus.hidden = false;
      documentStatus.classList.add("is-error");
      const message = document.createTextNode("The document could not be displayed here. ");
      const fallbackLink = document.createElement("a");
      fallbackLink.href = `${repositoryDocsUrl}${doc.file}`;
      fallbackLink.target = "_blank";
      fallbackLink.rel = "noopener noreferrer";
      fallbackLink.textContent = "Open the Markdown source on GitHub";
      documentStatus.replaceChildren(message, fallbackLink, document.createTextNode("."));
      console.error("PawPath documentation render failed:", error);
    }
  };

  const route = () => {
    const hash = window.location.hash.replace(/^#/, "").trim();
    if (!hash || hash === "home") {
      setHomeView();
      return;
    }

    const doc = findDocumentByHash();
    if (!doc) {
      window.location.hash = "home";
      return;
    }

    renderDocument(doc);
  };

  homeLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.location.hash === "#home") {
        setHomeView();
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    });
  });

  window.addEventListener("hashchange", route);
  route();
})();
