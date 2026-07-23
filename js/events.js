import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore, collection, query, where, orderBy, getDocs,
  doc, getDoc, Timestamp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const WHATSAPP_NUMBER = "201204137431";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const grid = document.getElementById("events-grid");
const emptyState = document.getElementById("events-empty");
const promoInput = document.getElementById("promo-input");
const promoBtn = document.getElementById("promo-apply");
const promoStatus = document.getElementById("promo-status");

let events = [];
let activePromo = null; // { code, discountType, discountValue }

function formatDate(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function formatPrice(n) {
  return `$${Number(n).toFixed(2)}`;
}

function discountedPrice(price) {
  if (!activePromo) return price;
  if (activePromo.discountType === "percent") {
    return Math.max(0, price - (price * activePromo.discountValue) / 100);
  }
  return Math.max(0, price - activePromo.discountValue);
}

function reserveUrl(event) {
  let text = `Hi! I'd like to reserve a spot for "${event.title}" on ${formatDate(event.startDate)}.`;
  if (activePromo) {
    text += ` I have promo code ${activePromo.code} applied.`;
  }
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
    const finalPrice = discountedPrice(price);
    const hasDiscount = activePromo && finalPrice < price;

    return `
      <article class="event-card">
        <div class="event-card-image" style="background-image:url('${event.imageUrl || "img/loader/logo-static.png"}')"></div>
        <div class="event-card-body">
          <h3 class="event-card-title">${escapeHtml(event.title)}</h3>
          <p class="event-card-meta">${formatDate(event.startDate)}${event.location ? " &middot; " + escapeHtml(event.location) : ""}</p>
          <p class="event-card-desc">${escapeHtml(event.description || "")}</p>
          <div class="event-card-footer">
            <div class="event-card-price">
              ${hasDiscount ? `<span class="price-old">${formatPrice(price)}</span>` : ""}
              <span class="price-now">${formatPrice(finalPrice)}</span>
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

async function applyPromoCode() {
  const raw = promoInput.value.trim();
  if (!raw) return;
  const code = raw.toUpperCase();

  promoStatus.textContent = "Checking...";
  promoStatus.className = "promo-status";

  try {
    const snap = await getDoc(doc(db, "promoCodes", code));
    if (!snap.exists()) {
      activePromo = null;
      promoStatus.textContent = "That code isn't valid.";
      promoStatus.className = "promo-status promo-status-error";
      renderEvents();
      return;
    }

    const data = snap.data();
    const now = new Date();
    const expired = data.expiresAt && data.expiresAt.toDate() < now;

    if (!data.active || expired) {
      activePromo = null;
      promoStatus.textContent = "That code has expired or is no longer active.";
      promoStatus.className = "promo-status promo-status-error";
      renderEvents();
      return;
    }

    activePromo = { code, discountType: data.discountType, discountValue: data.discountValue };
    const label = data.discountType === "percent" ? `${data.discountValue}% off` : `${formatPrice(data.discountValue)} off`;
    promoStatus.textContent = `Applied! ${label} your reservation.`;
    promoStatus.className = "promo-status promo-status-success";
    renderEvents();
  } catch (err) {
    console.error("Failed to validate promo code:", err);
    promoStatus.textContent = "Couldn't check that code right now. Please try again.";
    promoStatus.className = "promo-status promo-status-error";
  }
}

promoBtn.addEventListener("click", applyPromoCode);
promoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") applyPromoCode();
});

loadEvents();
