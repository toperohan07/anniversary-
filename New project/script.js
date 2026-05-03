const anniversaryDate = new Date("2026-05-05T00:00:00+05:30");
const countdown = document.querySelector("#countdown");

function renderCountdown() {
  const now = new Date();
  const difference = anniversaryDate - now;

  if (difference <= 0) {
    countdown.innerHTML = "<span><b>Happy</b>Anniversary</span>";
    return;
  }

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdown.innerHTML = `
    <span><b>${days}</b>Days</span>
    <span><b>${hours}</b>Hours</span>
    <span><b>${minutes}</b>Minutes</span>
    <span><b>${seconds}</b>Seconds</span>
  `;
}

renderCountdown();
setInterval(renderCountdown, 1000);

const caption = document.querySelector("#gallery-caption");
const featuredImage = document.querySelector("#featured-image");
const featuredPhoto = document.querySelector(".featured-photo");
const photoTiles = document.querySelectorAll(".photo-tile");
const lightbox = document.querySelector("#photo-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const closeLightboxButton = document.querySelector(".lightbox-close");
const previousButton = document.querySelector(".lightbox-prev");
const nextButton = document.querySelector(".lightbox-next");
let activePhotoIndex = 0;

function setActivePhoto(index, shouldOpen = false) {
  const tile = photoTiles[index];
  if (!tile) return;

  activePhotoIndex = index;
  photoTiles.forEach((item) => item.classList.remove("active"));
  tile.classList.add("active");
  featuredImage.src = tile.dataset.full;
  featuredImage.alt = tile.querySelector("img").alt;
  caption.textContent = tile.dataset.caption;

  lightboxImage.src = tile.dataset.full;
  lightboxImage.alt = tile.querySelector("img").alt;
  lightboxCaption.textContent = tile.dataset.caption;

  if (shouldOpen) openLightbox();
}

function openLightbox() {
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function movePhoto(direction) {
  const nextIndex = (activePhotoIndex + direction + photoTiles.length) % photoTiles.length;
  setActivePhoto(nextIndex);
}

function applyTilt(element, event, prefix, intensity = 10) {
  const rect = element.getBoundingClientRect();
  const point = event.touches ? event.touches[0] : event;
  const x = (point.clientX - rect.left) / rect.width - 0.5;
  const y = (point.clientY - rect.top) / rect.height - 0.5;

  element.style.setProperty(`--${prefix}-tilt-x`, `${(-y * intensity).toFixed(2)}deg`);
  element.style.setProperty(`--${prefix}-tilt-y`, `${(x * intensity).toFixed(2)}deg`);
}

function resetTilt(element, prefix) {
  element.style.setProperty(`--${prefix}-tilt-x`, "0deg");
  element.style.setProperty(`--${prefix}-tilt-y`, "0deg");
}

photoTiles.forEach((tile, index) => {
  tile.addEventListener("click", () => {
    setActivePhoto(index);
  });

  tile.addEventListener("pointermove", (event) => applyTilt(tile, event, "tile", 12));
  tile.addEventListener("pointerleave", () => resetTilt(tile, "tile"));
  tile.addEventListener("pointerdown", () => tile.classList.add("is-pressed"));
  tile.addEventListener("pointerup", () => tile.classList.remove("is-pressed"));
  tile.addEventListener("pointercancel", () => {
    tile.classList.remove("is-pressed");
    resetTilt(tile, "tile");
  });
});

featuredPhoto.addEventListener("click", openLightbox);
featuredPhoto.addEventListener("pointermove", (event) => applyTilt(featuredPhoto, event, "photo", 7));
featuredPhoto.addEventListener("pointerleave", () => resetTilt(featuredPhoto, "photo"));
featuredPhoto.addEventListener("pointerdown", () => featuredPhoto.classList.add("is-pressed"));
featuredPhoto.addEventListener("pointerup", () => featuredPhoto.classList.remove("is-pressed"));
featuredPhoto.addEventListener("pointercancel", () => featuredPhoto.classList.remove("is-pressed"));

closeLightboxButton.addEventListener("click", closeLightbox);
previousButton.addEventListener("click", () => movePhoto(-1));
nextButton.addEventListener("click", () => movePhoto(1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

lightbox.addEventListener("pointermove", (event) => applyTilt(lightbox, event, "modal", 5));
lightbox.addEventListener("pointerleave", () => resetTilt(lightbox, "modal"));

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") movePhoto(-1);
  if (event.key === "ArrowRight") movePhoto(1);
});

const memoryObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("in-view");
  });
}, { threshold: 0.28 });

document.querySelectorAll(".memory").forEach((memory) => memoryObserver.observe(memory));
