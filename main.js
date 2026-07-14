/**
 * Kemetian Tours — main.js
 * Vanilla JS, no dependencies. Each feature is an isolated init function
 * that fails silently if its markup is absent (safe for partial pages).
 */
(() => {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  function initNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    toggle.addEventListener("click", () =>
      setOpen(!nav.classList.contains("is-open"))
    );

    // Close after choosing a link (mobile) and on Escape
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* ---------- Sticky header shadow ---------- */
  function initHeaderShadow() {
    const header = document.querySelector("[data-header]");
    if (!header) return;

    const update = () =>
      header.classList.toggle("is-scrolled", window.scrollY > 8);

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ---------- FAQ tabs (accessible, keyboard-navigable) ---------- */
  function initTabs() {
    const root = document.querySelector("[data-tabs]");
    if (!root) return;

    const tabs = [...root.querySelectorAll("[role='tab']")];
    const panels = [...root.querySelectorAll("[role='tabpanel']")];

    const activate = (tab) => {
      tabs.forEach((t) => {
        const selected = t === tab;
        t.classList.toggle("is-active", selected);
        t.setAttribute("aria-selected", String(selected));
        t.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((p) => {
        const active = p.id === tab.getAttribute("aria-controls");
        p.hidden = !active;
        p.classList.toggle("is-active", active);
      });
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", (e) => {
        const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (!dir) return;
        e.preventDefault();
        const next = tabs[(i + dir + tabs.length) % tabs.length];
        next.focus();
        activate(next);
      });
    });
  }

  /* ---------- Scroll-reveal (respects reduced motion) ---------- */
  function initReveal() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ---------- Contact form (client-side validation) ----------
     NOTE: this validates and confirms locally. Wire the submit
     handler to your real endpoint (e.g. a WordPress REST route,
     Formspree, or your own API) where marked below.            */
  function initContactForm() {
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;

    const status = form.querySelector("[data-form-status]");

    const setStatus = (msg, type) => {
      status.textContent = msg;
      status.className = `form__status is-${type}`;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validate
      let valid = true;
      form.querySelectorAll("input, textarea").forEach((field) => {
        const wrapper = field.closest(".field");
        const ok = field.checkValidity();
        wrapper.classList.toggle("has-error", !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        setStatus("Please fill in all fields with a valid email.", "error");
        return;
      }

      const data = Object.fromEntries(new FormData(form));

      try {
        // TODO: replace with your real endpoint:
        // await fetch("/api/contact", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(data),
        // });
        console.info("Contact form payload:", data);
        form.reset();
        setStatus("Thanks! We'll get back to you within 24 hours.", "success");
      } catch (err) {
        console.error("Contact form submission failed:", err);
        setStatus("Something went wrong. Please try again or reach us on WhatsApp.", "error");
      }
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    const el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initHeaderShadow();
    initTabs();
    initReveal();
    initContactForm();
    initYear();
  });
})();
