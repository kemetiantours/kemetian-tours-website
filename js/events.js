import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
// The regular Firestore SDK keeps a persistent "Listen/channel" connection
// open in the background (for realtime updates we don't use), and ad
// blockers/privacy shields (Brave Shields, uBlock, etc.) commonly flag that
// specific request pattern as tracking and block it. The "lite" SDK only
// makes plain, one-off HTTPS requests, which don't get flagged.
import {
  getFirestore, collection, query, where, orderBy, getDocs, Timestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-lite.js";
import { firebaseConfig } from "./firebase-config.js";

const WHATSAPP_NUMBER = "201204137431";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const grid = document.getElementById("events-grid");
const emptyState = document.getElementById("events-empty");

function formatDate(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function formatPrice(n) {
  return `$${Number(n).toFixed(2)}`;
}

function reserveUrl(event) {
  const text = `Hi! I'd like to reserve a spot for "${event.title}" on ${formatDate(event.startDate)}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function renderEvents() {
  if (!events.length) {
    emptyState.hidden = false;
    grid.innerHTML = "";
    return;
  }
  emptyState.hidden = true;

  grid.innerHTML = events.map((event) => {
    const price = Number(event.price) || 0;
    return `
      <article class="event-card">
        <div class="event-card-image" style="background-image:url('${event.imageUrl || "img/loader/logo-static.png"}')"></div>
        <div class="event-card-body">
          <h3 class="event-card-title">${escapeHtml(event.title)}</h3>
          <p class="event-card-meta">${formatDate(event.startDate)}${event.location ? " &middot; " + escapeHtml(event.location) : ""}</p>
          <p class="event-card-desc">${escapeHtml(event.description || "")}</p>
          <div class="event-card-footer">
            <div class="event-card-price">
              <span class="price-now">${formatPrice(price)}</span>
            </div>
            <a class="event-reserve-btn" target="_blank" rel="noopener" href="${reserveUrl(event)}">Reserve</a>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

let events = [];

async function loadEvents() {
  try {
    const q = query(
      collection(db, "events"),
      where("active", "==", true),
      where("startDate", ">=", Timestamp.now()),
      orderBy("startDate", "asc")
    );
    const snap = await getDocs(q);
    events = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderEvents();
  } catch (err) {
    console.error("Failed to load events:", err);
    grid.innerHTML = "";
    emptyState.hidden = false;
    emptyState.textContent = "Couldn't load events right now. Please try again later.";
  }
}

loadEvents();
