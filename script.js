// Ganti dengan nomor WhatsApp bisnis Anda (format internasional, tanpa + atau spasi)
const NOMOR_WA = "6281200000000";

const nav = document.getElementById("nav");
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");

// Bayangan navbar saat halaman di-scroll
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 10);
});

// Menu mobile
burger.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  burger.setAttribute("aria-expanded", open);
});
menu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    menu.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  })
);

// Tandai menu sesuai bagian yang sedang dilihat
const links = [...menu.querySelectorAll("a:not(.btn)")];
const sections = links.map((a) => document.querySelector(a.getAttribute("href")));
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => s && spy.observe(s));

// Angka statistik naik saat terlihat
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function countUp(el) {
  const target = +el.dataset.count;
  if (reduceMotion) { el.textContent = target; return; }
  const start = performance.now();
  const dur = 1200;
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * p);
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
const statObs = new IntersectionObserver((entries, obs) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.querySelectorAll("[data-count]").forEach(countUp);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
statObs.observe(document.getElementById("stats"));

// Validasi form, lalu kirim ke WhatsApp
const form = document.getElementById("form");
const ok = document.getElementById("ok");

function setError(field, msg) {
  field.classList.toggle("invalid", !!msg);
  field.parentElement.querySelector(".err").textContent = msg;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  ok.textContent = "";
  const { nama, email, layanan, pesan } = form.elements;
  let valid = true;

  setError(nama, nama.value.trim() ? "" : "Nama wajib diisi.");
  if (!nama.value.trim()) valid = false;

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  setError(email, emailOk ? "" : "Masukkan email yang valid, contoh: nama@email.com.");
  if (!emailOk) valid = false;

  const pesanOk = pesan.value.trim().length >= 10;
  setError(pesan, pesanOk ? "" : "Pesan minimal 10 karakter.");
  if (!pesanOk) valid = false;

  if (!valid) return;

  const teks =
    `Halo Kodeva Studio, saya ${nama.value.trim()} (${email.value.trim()}).\n` +
    `Layanan: ${layanan.value}\n${pesan.value.trim()}`;
  window.open(`https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(teks)}`, "_blank", "noopener");
  ok.textContent = "Terima kasih! WhatsApp akan terbuka dengan pesan Anda.";
  form.reset();
});

// Tahun di footer
document.getElementById("year").textContent = new Date().getFullYear();
