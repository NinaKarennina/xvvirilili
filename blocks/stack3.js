// blocks/stack3.js
export function createStack3({
  heights = ["30vh","30vh","20vh"],   // acepta números (vh) o strings ("30vh")
  width   = "min(92vw, 720px)",
  gap     = "1rem",
  zIndex  = 3,
  items   = [
    { kind:"image", src:"", alt:"" },
    { kind:"buttonImage", src:"", alt:"", onClick:null },
    { kind:"html", html:"" }
  ],
}) {
  const H = heights.map(h => typeof h === "number" ? `${h}vh` : h);

  const root = document.createElement("div");
  root.className = "s3";
  root.style.setProperty("--s3-width", width);
  root.style.setProperty("--s3-gap", gap);
  root.style.setProperty("--s3-z", zIndex);
  root.style.setProperty("--s3-h1", H[0] || "auto");
  root.style.setProperty("--s3-h2", H[1] || "auto");
  root.style.setProperty("--s3-h3", H[2] || "auto");

  const mkSlot = (i, cfg = {}) => {
    const wrap = document.createElement("div");
    wrap.className = `s3-slot s3-slot-${i+1}`;

    const kind = cfg.kind || "image";
    if (kind === "image") {
      const img = document.createElement("img");
      img.className = "s3-img";
      img.src = cfg.src || "";
      img.alt = cfg.alt || "";
      wrap.appendChild(img);
    } else if (kind === "buttonImage") {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "s3-btn";
      if (typeof cfg.onClick === "function") btn.addEventListener("click", cfg.onClick);
      const img = document.createElement("img");
      img.className = "s3-img";
      img.src = cfg.src || "";
      img.alt = cfg.alt || "";
      btn.appendChild(img);
      wrap.appendChild(btn);
    } else if (kind === "html") {
      const box = document.createElement("div");
      box.className = "s3-html";
      box.innerHTML = cfg.html || "";
      wrap.appendChild(box);
    }
    return wrap;
  };

  root.appendChild(mkSlot(0, items[0]));
  root.appendChild(mkSlot(1, items[1]));
  root.appendChild(mkSlot(2, items[2]));

  return root;
}

// CSS una sola vez
const STYLE_ID = "stack3-style";
if (!document.getElementById(STYLE_ID)) {
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    .s3{
      position:absolute;
      top:50%;
      left:50%;
      transform:translate(-50%,-50%);
      max-width:80vw;
      max-height:80vh;
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      gap:var(--s3-gap,1rem);
      z-index:var(--s3-z,3);
      pointer-events:auto;
    }
    .s3-slot{
      position:relative;
      overflow:hidden;
      justify-content:center;
      align-items:center;
      align-content:center:
      text-align:center;
      border-radius:16px;
      background:rgba(0,0,0,0);
    }
    .s3-slot-1{ max-height:var(--s3-h1);max-width:80vw; }
    .s3-slot-2{ max-height:var(--s3-h2);max-width:80vw; }
    .s3-slot-3{ max-height:var(--s3-h3);max-width:80vw; }

    .s3-img{
      max-width:100%; 
      max-height:100%;
      object-fit:contain;
      object-position: center center;
      user-select:none; -webkit-user-drag:none;
    }
    .s3-btn{
      width:100%; height:100%;
      display:block; padding:0; border:none;
      background:transparent; cursor:pointer; outline-offset:4px;
    }
    .s3-btn:active{ transform:scale(.995); }

    .s3-html{
      width:100%; height:100%;
      padding:1rem; display:grid; place-items:center;
      color:#fff; text-align:center;
      font:500 1rem/1.4 system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Arial, sans-serif;
    }
    @media (max-width:480px){
      .s3{ gap:.8rem; }
      .s3-slot{ border-radius:12px; }
    }
  `;
  document.head.appendChild(style);
}
