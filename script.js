const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const header = document.querySelector(".site-header");

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const open = mobileMenu.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  document.querySelectorAll(".mobile-menu a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

window.addEventListener("scroll", () => {
  if (header) header.classList.toggle("scrolled", window.scrollY > 30);
});

const dateInput = document.getElementById("date");
if (dateInput) {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  dateInput.min = `${y}-${m}-${d}`;
}

const bookingForm = document.getElementById("bookingForm");
const paymentPanel = document.getElementById("paymentPanel");
const bookingSuccess = document.getElementById("bookingSuccess");
const paymentBack = document.getElementById("paymentBack");
const payButton = document.getElementById("payButton");
const newBooking = document.getElementById("newBooking");

const service = document.getElementById("service");
const date = document.getElementById("date");
const time = document.getElementById("time");
const nailExtras = document.getElementById("nailExtras");
const extraInputs = [...document.querySelectorAll('input[name="extra"]')];

const summaryService = document.getElementById("summaryService");
const summaryDate = document.getElementById("summaryDate");
const summaryTime = document.getElementById("summaryTime");

const successService = document.getElementById("successService");
const successDate = document.getElementById("successDate");
const successTime = document.getElementById("successTime");

document.querySelectorAll("[data-service]").forEach(link => {
  link.addEventListener("click", () => {
    const requested = link.dataset.service;
    if (service) {
      const option = [...service.options].find(o => o.value === requested);
      if (option) service.value = requested;
    }
  });
});


const servicePrices = {
  "Manicura": 22,
  "Manicura navideña": 29,
  "Manicura rusa": 32,
  "Pedicura": 28,
  "Cejas": 15,
  "Lifting de pestañas": 30,
  "MIMI Combo": 55
};

function isNailService(value) {
  return ["Manicura", "Manicura navideña", "Manicura rusa"].includes(value);
}

function getExtras() {
  return extraInputs
    .filter(input => input.checked)
    .map(input => ({ name: input.value, price: Number(input.dataset.price) }));
}

function updateExtrasVisibility() {
  if (!nailExtras || !service) return;
  const show = isNailService(service.value);
  nailExtras.hidden = !show;
  if (!show) extraInputs.forEach(input => input.checked = false);
}

function calculateTotal() {
  const base = servicePrices[service.value] || 0;
  return base + getExtras().reduce((sum, item) => sum + item.price, 0);
}

if (service) service.addEventListener("change", updateExtrasVisibility);
extraInputs.forEach(input => input.addEventListener("change", () => {}));
updateExtrasVisibility();

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const selectedDate = new Date(date.value + "T12:00:00");
    const formattedDate = new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(selectedDate);

    summaryService.textContent = service.value;
    summaryDate.textContent = formattedDate;
    summaryTime.textContent = time.value;

    const extras = getExtras();
    document.getElementById("summaryExtras").textContent =
      extras.length ? extras.map(item => `${item.name} (+${item.price} €)`).join(", ") : "Ninguno";
    document.getElementById("summaryTotal").textContent = `${calculateTotal().toFixed(2).replace(".", ",")} €`;

    bookingForm.hidden = true;
    paymentPanel.hidden = false;
  });
}

if (paymentBack) {
  paymentBack.addEventListener("click", () => {
    paymentPanel.hidden = true;
    bookingForm.hidden = false;
  });
}

if (payButton) {
  payButton.addEventListener("click", () => {
    successService.textContent = service.value;
    successDate.textContent = summaryDate.textContent;
    successTime.textContent = time.value;

    paymentPanel.hidden = true;
    bookingSuccess.hidden = false;

    bookingSuccess.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });
}

if (newBooking) {
  newBooking.addEventListener("click", () => {
    bookingSuccess.hidden = true;
    bookingForm.reset();
    updateExtrasVisibility();
    bookingForm.hidden = false;
    bookingForm.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;

    const target = document.querySelector(id);
    if (!target) return;

    event.preventDefault();

    const headerHeight = header ? header.offsetHeight : 0;

    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - headerHeight,
      behavior: "smooth"
    });
  });
});
