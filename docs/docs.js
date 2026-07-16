(() => {
  "use strict";

  const documents = [
    {
      slug: "why-pawpath",
      file: "WHY_PAWPATH.md",
      title: "Why PawPath?",
      eyebrow: "Product distinction",
      description: "The travel problem PawPath solves, who it serves, and why the outcome must be a care plan rather than a list of places."
    },
    {
      slug: "product-vision",
      file: "PRODUCT_VISION.md",
      title: "Product Vision",
      eyebrow: "Product direction",
      description: "The mission, primary user needs, core experiences, trust principles, success criteria, and long-term opportunity."
    },
    {
      slug: "poc-scope",
      file: "POC_SCOPE.md",
      title: "Proof-of-Concept Scope",
      eyebrow: "Current experience",
      description: "The care-planning outcome, required workflows, safety boundaries, confidence model, acceptance criteria, and explicit non-goals."
    },
    {
      slug: "roadmap",
      file: "ROADMAP.md",
      title: "Roadmap",
      eyebrow: "Future direction",
      description: "The phased path from the care-plan proof of concept to stronger trust, multi-stop planning, offline readiness, and portable pet information."
    }
  ];

  const blockedPublicReference = /chatgpt|brand[_\s-]?guide|phase\s*1\s*backlog|implementation[_\s-]?notes|demo[_\s-]?script/i;
  const home = document.querySelector("#docs-home");
  const documentView = document.querySelector("#document-view");
  const documentTitle = document.querySelector("#document-title");
  const documentEyebrow = document.querySelector("#document-eyebrow");
  const documentDescription = document.querySelector("#document-description");
  const documentStatus = document.querySelector("#document-status");
  const markdownContent = document.querySelector("#markdown-content");
  const previousLink = document.querySelector("#previous-document");
  const nextLink = document.querySelector("#next-document");
  const homeLinks = document.querySelectorAll("[data-home-link]");
  let renderRequest = 0;

  const findDocumentByHash = () => {
    const slug = window.location.hash.replace(/^#/, "").trim();
    return documents.find((documentItem) => documentItem.slug === slug) || null;
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

  const removeBlockedReference = (link) => {
    const parent = link.closest("li, p");
    if (parent && parent.textContent.trim() === link.textContent.trim()) {
      parent.remove();
      return;
    }
    link.remove();
  };

  const makeRenderedLinksSafe = () => {
    markdownContent.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href") || "";
      const label = link.textContent || "";

      if (blockedPublicReference.test(`${href} ${label}`)) {
        removeBlockedReference(link);
        return;
      }

      const matchingDocument = documents.find((documentItem) => href.endsWith(documentItem.file));
      if (matchingDocument) {
        link.setAttribute("href", `#${matchingDocument.slug}`);
        return;
      }

      if (/\.md(?:#.*)?$/i.test(href)) {
        removeBlockedReference(link);
        return;
      }

      if (/^https?:\/\//i.test(href)) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    });
  };

  const removeBlockedRenderedSections = () => {
    markdownContent.querySelectorAll("h1, h2, h3, h4, p, li").forEach((element) => {
      if (blockedPublicReference.test(element.textContent || "")) {
        element.remove();
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
      markdownContent.querySelector("h1")?.remove();
      removeBlockedRenderedSections();
      makeRenderedLinksSafe();
      documentStatus.hidden = true;
      documentTitle.focus();
    } catch (error) {
      if (requestId !== renderRequest) return;
      documentStatus.hidden = false;
      documentStatus.classList.add("is-error");
      const message = document.createTextNode("The document could not be displayed here. ");
      const fallbackLink = document.createElement("a");
      fallbackLink.href = doc.file;
      fallbackLink.textContent = "Open the document directly";
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
