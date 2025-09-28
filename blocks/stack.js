// blocks/stack3.js
export function createStack({
  items = [],                        // [{ kind: 'image'|'buttonImage'|'html'|'node', ... }]
  width = "80vw",        // ancho del stack
  height = "auto",                   // "auto" o un valor (ej. "80vh") para usar distribute
  maxHeight = "80vh",                // límite superior
  gap = "1rem",                      // separación vertical
  zIndex = 3,
  // MODO A) alturas explícitas por fila (si se define, ignora 'distribute')
  heights = null,                    // ej: [20, 50, 10] -> vh; o ["15vh","1fr","8vh"]
  // MODO B) distribución vertical del espacio (requiere height != "auto")
  distribute = "between",            // 'between' | 'around' | 'evenly' | 'start' | 'center' | 'end'
} = {}) {
  const root = document.createElement("div");
  root.className = "s3";
  root.style.setProperty("--s3-width", width);
  root.style.setProperty("--s3-height", height);
  root.style.setProperty("--s3-maxh", maxHeight);
  root.style.setProperty("--s3-gap", gap);
  root.style.setProperty("--s3-z", zIndex);

  // Grid rows según modo elegido
  if (Array.isArray(heights) && heights.length > 0) {
    const rows = heights.map(h =>
      `minmax(0, ${typeof h === "number" ? `${h}vh` : h})`
    ).join(" ");
    root.style.setProperty("--s3-rows", rows);
    root.style.setProperty("--s3-align", "start"); // sin distribución, respeta alturas
  } else {
    // Distribución vertical (necesita altura fija para que tenga efecto)
    const map = {
      between: "space-between",
      around:  "space-around",
      evenly:  "space-evenly",
      start:   "start",
      end:     "end",
      center:  "center",
    };
    root.style.setProperty("--s3-rows", "auto");
    root.style.setProperty("--s3-align", map[distribute] || "space-between");
  }

  // Crear slots según items
  items.forEach((cfg = {}, idx) => {
    const slot = document.createElement("div");
    slot.className = "s3-slot";
    slot.dataset.index = String(idx);

    const kind = (cfg.kind || "image");

    if (kind === "image") {
      const img = document.createElement("img");
      img.className = "s3-img";
      img.src = cfg.src || "";
      img.alt = cfg.alt || "";
      if (cfg.fit === "cover") img.classList.add("cover");
      slot.appendChild(img);

    } else if (kind === "buttonImage") {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "s3-btn";
      if (typeof cfg.onClick === "function") btn.addEventListener("click", cfg.onClick);
      const img = document.createElement("img");
      img.className = "s3-img";
      img.src = cfg.src || "";
      img.alt = cfg.alt || "";
      if (cfg.fit === "cover") img.classList.add("cover");
      btn.appendChild(img);
      slot.appendChild(btn);

    } else if (kind === "html") {
      const box = document.createElement("div");
      box.className = "s3-html";
      box.innerHTML = cfg.html || "";
      slot.appendChild(box);

    } else if (kind === "node" && cfg.node instanceof Node) {
      slot.appendChild(cfg.node);
    }

    root.appendChild(slot);
  });

  return root;
}

// ====== CSS (una sola vez) ======
const STYLE_ID = "stack3-style";
if (!document.getElementById(STYLE_ID)) {
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .s3{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      width: var(--s3-width, min(92vw, 720px));
      height: var(--s3-height, auto);   /* si 'auto', crece por contenido */
      max-height: var(--s3-maxh, 80vh);
      z-index: var(--s3-z, 3);
      pointer-events: auto;

      /* GRID vertical */
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: var(--s3-rows, auto);
      grid-auto-rows: auto;
      row-gap: var(--s3-gap, 1rem);

      /* distribución vertical (solo si height ≠ auto) */
      align-content: center;
      justify-items: center;
      align-items: center;
    }

    .s3-slot{
      position: relative;
      overflow: hidden;
      display: flex;
      align-items:stretch;
      align-content:stretch:
      justify-content:center;     /* centra el contenido del slot */
      /* background: rgba(0,0,0,.02); */ /* si quieres testear área */
    }

    /* Tipos de contenido */
    .s3-img{
      max-width:50vh ; max-height:20vh ;
      object-fit: contain;
      object-position: center;
      user-select: none; -webkit-user-drag: none;
      display: block;
      pointer-events: none; /* decorativas por defecto */
    }
    .s3-img.cover{
      width: 100%; height: 100%;
      max-width: none; max-height: none;
      object-fit: contain;
    }

    .s3-btn{
      width: 100%; height: 100%;
      display: grid; place-items: center;
      padding: 0; border: none; background: transparent;
      cursor: pointer; outline-offset: 4px;
    }
    .s3-btn:active{ transform: scale(.995); }

    .s3-html{
      width: 100%; height: 100%;
      padding: 1rem;
      display: grid; place-items: center;
      text-align: center; color: #fff;
      font: 500 1rem/1.4 system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Arial, sans-serif;
    }

  `;
  document.head.appendChild(style);
}

// Export alternativo para mantener compatibilidad con tu código previo
export { createStack as createStack3 };
