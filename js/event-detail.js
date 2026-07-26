import { firebaseConfig } from "./firebase-config.js";

const FS_BASE = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;
const WEB3FORMS_ACCESS_KEY = "41984132-1850-4442-9137-8a2712a50798";

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, Object.assign({}, options, { signal: controller.signal }));
  } finally {
    clearTimeout(timer);
  }
}

function parseFirestoreValue(v) {
  if (!v) return undefined;
  if ("stringValue" in v) return v.stringValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("timestampValue" in v) return new Date(v.timestampValue);
  if ("nullValue" in v) return null;
  if ("arrayValue" in v) return (v.arrayValue.values || []).map(parseFirestoreValue);
  if ("mapValue" in v) return parseFirestoreFields(v.mapValue.fields);
  return undefined;
}

function parseFirestoreFields(fields) {
  const out = {};
  for (const key in fields || {}) out[key] = parseFirestoreValue(fields[key]);
  return out;
}

function formatDate(d) {
  if (!(d instanceof Date)) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function formatPrice(n) {
  return `$${Number(n).toFixed(2)}`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

const FALLBACK_IMAGE = "img/loader/logo-static.png";

const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");

const root = document.getElementById("story-root");
const detailError = document.getElementById("detail-error");
const nav = document.getElementById("story-nav");

window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
});

function showError() {
  detailError.hidden = false;
  root.hidden = true;
}

async function loadEvent() {
  if (!eventId) {
    showError();
    return;
  }
  try {
    const res = await fetchWithTimeout(
      `${FS_BASE}/events/${encodeURIComponent(eventId)}?key=${firebaseConfig.apiKey}`,
      {}, 12000
    );
    if (!res.ok) {
      showError();
      return;
    }
    const json = await res.json();
    const data = parseFirestoreFields(json.fields);
    renderEvent(data);
  } catch (err) {
    console.error("Failed to load event:", err);
    showError();
  }
}

function daysFromEvent(event, cover) {
  if (Array.isArray(event.days) && event.days.length) return event.days;
  // Back-compat: events created before the per-day editor stored one
  // "itinerary" text block (one line per day) and a separate
  // "galleryImages" list, paired up by index.
  const lines = (event.itinerary || "").split("\n").map((l) => l.trim()).filter(Boolean);
  const images = event.galleryImages || [];
  return lines.map((line, i) => {
    const match = line.match(/^(Day\s*\d+[:\-]?)\s*(.*)$/i);
    return {
      label: match ? match[1].replace(/[:\-]$/, "") : `Day ${i + 1}`,
      text: match ? match[2] : line,
      image: images[i] || cover
    };
  });
}

function renderEvent(event) {
  document.title = (event.title || "Event") + " - kemetiantours.com";

  const images = [];
  if (event.imageUrl) images.push(event.imageUrl);
  (event.galleryImages || []).forEach((url) => {
    if (url && !images.includes(url)) images.push(url);
  });
  const cover = images[0] || FALLBACK_IMAGE;

  const metaParts = [];
  if (event.startDate instanceof Date) metaParts.push(formatDate(event.startDate));
  if (event.location) metaParts.push(event.location);

  const days = daysFromEvent(event, cover);

  let html = `
    <section class="story-hero" style="background-image:url('${cover}')">
      <div class="story-hero-content">
        <span class="story-hero-tag">${escapeHtml(metaParts.join(" · ") || "Upcoming Trip")}</span>
        <h1>${escapeHtml(event.title || "Untitled trip")}</h1>
        <p>${escapeHtml(event.description || "")}</p>
      </div>
      <div class="story-scroll-cue" aria-hidden="true"></div>
    </section>
  `;

  if (days.length) {
    html += days.map((day, i) => {
      const bg = day.image || images[i % images.length] || cover;
      const align = i % 2 === 1 ? "align-right" : "";
      return `
        <section class="story-section ${align}" style="background-image:url('${bg}')">
          <div class="story-section-content">
            <span class="story-day-label">${escapeHtml(day.label || `Day ${i + 1}`)}</span>
            <p>${escapeHtml(day.text || "")}</p>
          </div>
        </section>
      `;
    }).join("");
  } else if (images.length > 1) {
    html += `<div class="story-gallery-strip">${images.slice(1).map((url) =>
      `<div class="g-img" style="background-image:url('${url}')"></div>`
    ).join("")}</div>`;
  }

  html += `
    <section class="story-booking">
      <div class="story-booking-card">
        <div class="story-price-row">
          <div>
            <div class="story-price-label">Starting from</div>
            <div class="story-price">${formatPrice(event.price || 0)}</div>
          </div>
          <div class="story-location">${event.location ? "\u{1F4CD} " + escapeHtml(event.location) : ""}</div>
        </div>
        <h3>Request to Book</h3>
        <form id="booking-form">
          <label>Full name
            <input type="text" id="rb-name" required>
          </label>
          <label>Email
            <input type="email" id="rb-email" required>
          </label>
          <label>Phone / WhatsApp
            <input type="tel" id="rb-phone">
          </label>
          <label>Notes (optional)
            <textarea id="rb-notes" rows="3"></textarea>
          </label>
          <div id="rb-error" class="error-text" hidden></div>
          <button type="submit" id="rb-submit">Send Booking Request</button>
        </form>
        <div id="booking-success" class="booking-success" hidden>
          &#10003; Thanks! Your booking request was sent - we'll get back to you within 24 hours.
        </div>
      </div>
    </section>
  `;

  const remarkLines = (event.remarks || "").split("\n").map((l) => l.trim()).filter(Boolean);
  if (remarkLines.length) {
    html += `
      <section class="story-remarks">
        <h2>Important Remarks</h2>
        <ul>${remarkLines.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
      </section>
    `;
  }

  html += `
    <footer class="kt-site-footer">
      <div class="kt-footer-inner">
        <a href="index.html" class="kt-footer-logo">
          <img src="img/loader/logo-static.png" alt="KemetianTours">
          <span>KemetianTours</span>
        </a>
        <nav class="kt-footer-links">
          <a href="index.html">Home</a>
          <a href="events.html">Upcoming Events</a>
          <a href="booking.html">Book a Tour</a>
          <a href="contact.html">Contact Us</a>
          <a href="terms.html">Terms of Service &amp; Cancellation Policy</a>
        </nav>
        <div class="kt-footer-social">
          <a href="https://www.facebook.com/kemetiantours" target="_blank" rel="noopener" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
          <a href="https://www.instagram.com/kemetiantours?igsh=MWdpNWdyc2o2a2xleQ%3D%3D&amp;utm_source=qr" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="https://www.tripadvisor.in/Attraction_Review-g60553-d34345306-Reviews-Kemetian_Tours_Egypt-Sheridan_Wyoming.html" target="_blank" rel="noopener" aria-label="TripAdvisor"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#00AF87"/><circle cx="7.6" cy="13.2" r="3.6" fill="#fff"/><circle cx="16.4" cy="13.2" r="3.6" fill="#fff"/><circle cx="7.6" cy="13.2" r="1.5" fill="#184848"/><circle cx="16.4" cy="13.2" r="1.5" fill="#184848"/><path d="M7 9.6 12 7.2 17 9.6" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
          <a href="https://wa.me/201204137431" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
        </div>
        <div class="kt-footer-divider"></div>
        <div class="kt-footer-copyright">&copy; 2026 KemetianTours. All rights reserved.</div>
      </div>
    </footer>
  `;

  root.innerHTML = html;

  setupReveal();
  document.getElementById("booking-form").addEventListener("submit", (e) => submitBooking(e, event));
}

function setupReveal() {
  const targets = document.querySelectorAll(".story-section, .story-description, .story-booking-card");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  targets.forEach((el) => observer.observe(el));
}

async function submitBooking(e, event) {
  e.preventDefault();
  const errorEl = document.getElementById("rb-error");
  errorEl.hidden = true;

  const name = document.getElementById("rb-name").value.trim();
  const email = document.getElementById("rb-email").value.trim();
  const phone = document.getElementById("rb-phone").value.trim();
  const notes = document.getElementById("rb-notes").value.trim();
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !emailRx.test(email)) {
    errorEl.textContent = "Please enter your name and a valid email address.";
    errorEl.hidden = false;
    return;
  }

  const btn = document.getElementById("rb-submit");
  btn.disabled = true;
  btn.textContent = "Sending…";

  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: "Event Booking Request - " + (event.title || "Untitled event"),
    from_name: name,
    replyto: email,
    name: name,
    email: email,
    phone: phone || "—",
    event: event.title || "—",
    event_date: event.startDate instanceof Date ? formatDate(event.startDate) : "—",
    price: formatPrice(event.price || 0),
    notes: notes || "—"
  };

  try {
    const response = await fetchWithTimeout("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    }, 20000);
    const result = await response.json();

    if (result.success) {
      document.getElementById("booking-form").hidden = true;
      document.getElementById("booking-success").hidden = false;
    } else {
      errorEl.textContent = "Something went wrong. Please try again.";
      errorEl.hidden = false;
      btn.disabled = false;
      btn.textContent = "Send Booking Request";
    }
  } catch (err) {
    errorEl.textContent = err.name === "AbortError"
      ? "This is taking longer than expected. Please try again."
      : "Network error. Please check your connection and try again.";
    errorEl.hidden = false;
    btn.disabled = false;
    btn.textContent = "Send Booking Request";
  }
}

loadEvent();
