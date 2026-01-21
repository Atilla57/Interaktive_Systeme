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



(() => {
  const KEY = {
    contrast: "a11y_contrast",
    underline: "a11y_underline",
    font: "a11y_font"
  };

  const openBtn = document.getElementById("a11yOpen");
  const closeBtn = document.getElementById("a11yClose");
  const panel = document.getElementById("a11yPanel");
  const overlay = document.getElementById("a11yOverlay");

  if (!openBtn || !closeBtn || !panel || !overlay) return;

  const btnContrast = document.getElementById("toggleContrast");
  const btnUnderline = document.getElementById("toggleUnderlineLinks");
  const fontScale = document.getElementById("fontScale");
  const fontScaleValue = document.getElementById("fontScaleValue");

  let lastFocus = null;

  const setPressed = (btn, on, labelOn = "An", labelOff = "Aus") => {
    if (!btn) return;
    btn.setAttribute("aria-pressed", String(on));
    btn.textContent = on ? labelOn : labelOff;
  };

  const applyContrast = (on) => {
    document.body.classList.toggle("high-contrast", on);
    setPressed(btnContrast, on);
    localStorage.setItem(KEY.contrast, on ? "1" : "0");
  };

  

  const applyUnderline = (on) => {
    document.body.classList.toggle("underline-links", on);
    setPressed(btnUnderline, on);
    localStorage.setItem(KEY.underline, on ? "1" : "0");
  };

  const applyFont = (value) => {
    const v = Math.max(100, Math.min(140, Number(value)));
    const scale = v / 100;

    document.documentElement.style.setProperty("--font-scale", String(scale));

    if (fontScaleValue) fontScaleValue.textContent = `${v}%`;
    if (fontScale) fontScale.value = String(v);

    localStorage.setItem(KEY.font, String(v));
  };


  const openPanel = () => {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    panel.hidden = false;

    // Fokus ins Panel (close button)
    closeBtn.focus();

    document.addEventListener("keydown", trapKeys);
  };

  const closePanel = () => {
    panel.hidden = true;
    overlay.hidden = true;
    document.removeEventListener("keydown", trapKeys);

    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  };

  const trapKeys = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closePanel();
      return;
    }

    // Minimaler Fokus-Trap: Tab im Panel halten
    if (e.key === "Tab" && !panel.hidden) {
      const focusables = panel.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const list = Array.from(focusables).filter(el => !el.disabled && el.offsetParent !== null);
      if (list.length === 0) return;

      const first = list[0];
      const last = list[list.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  // Open/Close
  openBtn.addEventListener("click", openPanel);
  closeBtn.addEventListener("click", closePanel);
  overlay.addEventListener("click", closePanel);

  // Toggle handlers
  btnContrast?.addEventListener("click", () => {
    applyContrast(!document.body.classList.contains("high-contrast"));
  });

  btnUnderline?.addEventListener("click", () => {
    applyUnderline(!document.body.classList.contains("underline-links"));
  });

  fontScale?.addEventListener("input", (e) => {
    applyFont(e.target.value);
  });

  // Initial state from localStorage
  applyContrast(localStorage.getItem(KEY.contrast) === "1");
  applyUnderline(localStorage.getItem(KEY.underline) === "1");

  const initialFont = localStorage.getItem(KEY.font) || "100";
  applyFont(initialFont);
})();
