(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// === Image Lightbox (Fullscreen on click) ===
document.addEventListener("click", function (e) {
  const img = e.target.closest("img");
  if (!img) return;

  // Verhindert doppelte Lightbox
  if (img.closest(".image-lightbox")) return;

  const overlay = document.createElement("div");
  overlay.className = "image-lightbox";

  const fullImg = document.createElement("img");
  fullImg.src = img.src;
  fullImg.alt = img.alt || "";

  overlay.appendChild(fullImg);
  document.body.appendChild(overlay);

  // Close on click
  overlay.addEventListener("click", () => {
    overlay.remove();
  });

  // Close on ESC
  document.addEventListener(
    "keydown",
    function escHandler(ev) {
      if (ev.key === "Escape") {
        overlay.remove();
        document.removeEventListener("keydown", escHandler);
      }
    },
    { once: true }
  );
});
