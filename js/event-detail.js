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

function parseFirestoreFields(fields) {
  const out = {};
  for (const key in fields || {}) {
    const v = fields[key];
    if ("stringValue" in v) out[key] = v.stringValue;
    else if ("booleanValue" in v) out[key] = v.booleanValue;
    else if ("integerValue" in v) out[key] = Number(v.integerValue);
    else if ("doubleValue" in v) out[key] = v.doubleValue;
    else if ("timestampValue" in v) out[key] = new Date(v.timestampValue);
    else if ("nullValue" in v) out[key] = null;
    else if ("arrayValue" in v) out[key] = (v.arrayValue.values || []).map((item) => parseFirestoreFields({ v: item }).v);
  }
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

const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");

const detailError = document.getElementById("detail-error");
const detailContent = document.getElementById("detail-content");

function showError() {
  document.getElementById("detail-title").textContent = "Event not found";
  detailError.hidden = false;
  detailContent.hidden = true;
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

function renderEvent(event) {
  document.title = (event.title || "Event") + " - kemetiantours.com";
  document.getElementById("detail-title").textContent = event.title || "Untitled event";

  const metaParts = [];
  if (event.startDate instanceof Date) metaParts.push(formatDate(event.startDate));
  if (event.location) metaParts.push(event.location);
  document.getElementById("detail-meta").textContent = metaParts.join(" · ");

  document.getElementById("detail-description").textContent = event.description || "";
  document.getElementById("detail-price").textContent = formatPrice(event.price || 0);
  document.getElementById("detail-location").textContent = event.location ? "\u{1F4CD} " + event.location : "";

  // Gallery: cover image first, then gallery images, de-duplicated.
  const images = [];
  if (event.imageUrl) images.push(event.imageUrl);
  (event.galleryImages || []).forEach((url) => {
    if (url && !images.includes(url)) images.push(url);
  });
  const galleryEl = document.getElementById("detail-gallery");
  if (images.length) {
    galleryEl.innerHTML = images.map((url) =>
      `<div class="detail-gallery-img" style="background-image:url('${url}')"></div>`
    ).join("");
  } else {
    galleryEl.innerHTML = `<div class="detail-gallery-img" style="background-image:url('img/loader/logo-static.png')"></div>`;
  }

  // Itinerary: one line per day.
  const lines = (event.itinerary || "").split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length) {
    document.getElementById("detail-itinerary-heading").hidden = false;
    document.getElementById("detail-itinerary").innerHTML = lines.map((line) => {
      const match = line.match(/^(Day\s*\d+[:\-]?)\s*(.*)$/i);
      return match
        ? `<li><strong>${escapeHtml(match[1])}</strong> ${escapeHtml(match[2])}</li>`
        : `<li>${escapeHtml(line)}</li>`;
    }).join("");
  }

  detailContent.hidden = false;

  document.getElementById("booking-form").addEventListener("submit", (e) => submitBooking(e, event));
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
