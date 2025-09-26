// blocks/hero.js
export function createHeroBlock({
  background,
  topLeft,
  rightCenter,
  center,
  bottomCenter,
  sizes = {},
}) {
  const { small = "18vmin", side = "46vmin" } = sizes;

  // Contenedor principal del bloque
  const section = document.createElement("section");
  section.className = "hero-block";
  section.style.setProperty("--img-small", small);
  section.style.setProperty("--img-side", side);

  // Imagen de fondo
  const bg = document.createElement("img");
  bg.className = "bg-cover";
  bg.src = background;
  bg.alt = "Fondo";
  section.appendChild(bg);

  // Imagen superior izquierda
  if (topLeft) {
    const tl = document.createElement("img");
    tl.className = "img-top-left";
    tl.src = topLeft;
    tl.alt = "Decoración esquina";
    section.appendChild(tl);
  }

  // Imagen derecha centrada
  if (rightCenter) {
    const rc = document.createElement("img");
    rc.className = "img-right-center";
    rc.src = rightCenter;
    rc.alt = "Decoración lateral";
    section.appendChild(rc);
  }

  // Centro absoluto
  if (center) {
    const c = document.createElement("img");
    c.className = "img-center";
    c.src = center;
    c.alt = "Decoración centro";
    section.appendChild(c);
  }

  // Abajo en el centro
  if (bottomCenter) {
    const bc = document.createElement("img");
    bc.className = "img-bottom-center";
    bc.src = bottomCenter;
    bc.alt = "Decoración inferior";
    section.appendChild(bc);
  }
  

  return section;
}

// Estilos inyectados (solo una vez)
const styleId = "hero-block-style";
if (!document.getElementById(styleId)) {
  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    .hero-block {
      position: relative;
      width: 100vw;
      height: 100svh;
      min-height: 100dvh;
      overflow: hidden;
    }
    .hero-block .bg-cover {
      position: absolute;
      inset: 0;
      width: 100%;
      height: auto;
      object-fit: cover;
      z-index: -1;
    }
    .hero-block .img-top-left {
      position: absolute;
      top: clamp(3vmin, 24px);
      left: clamp(3vmin, 24px);
      max-width: 250px;
      height: auto;
      object-fit: contain;
      pointer-events: none;
    }
    .hero-block .img-right-center {
      position: absolute;
      top: 50%;
      right: clamp(8px, 3vmin, 24px);
      transform: translate(50%,-50%);
      width: auto;
      max-height: 150px;
      object-fit: contain;
      pointer-events: none;
    }
    .hero-block .img-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -55%);
      max-width: 350px;   /* ajusta según tu diseño */
      max-height: 50vh;
      object-fit: contain;
      z-index: 2;
      pointer-events: none;
    }
    .hero-block .img-bottom-center {
      position: absolute;
      bottom: clamp(1px, 3vmin, 24px);
      left: 50%;
      transform: translate(-50%,-100%);
      max-width: 350px; 
      max-height: 30vh;
      object-fit: contain;
      z-index: 2;
      pointer-events: none;
    }

      `;
  document.head.appendChild(style);
}
