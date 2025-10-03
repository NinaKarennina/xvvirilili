// components/guestModal.js
// Modal accesible + envío a Google Apps Script (FormData + no-cors)
// Estilo acorde a tu invitación + decoraciones opcionales en 5 posiciones

export function initGuestModal({
  scriptURL,
  title = 'Lista de invitados',
  description = 'Déjanos tu nombre, cuántas personas vienen y un mensaje opcional.',
  decorTopLeftSrc = '',
  decorTopRightSrc = '',
  decorBottomCenterSrc = '',
  decorRightCenterSrc = '',
  decorLeftCenterSrc = ''
} = {}) {
  if (!scriptURL) throw new Error('initGuestModal: falta scriptURL');

  // ===== CSS (inyectado una sola vez) =====
  if (!document.getElementById('guest-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'guest-modal-styles';
    style.textContent = `
:root{
  --paper:#fff8f2; --ink:#5a3e3a;
  --rose:#a77a71; --blue:#87a3c4;
  --gold1:#caa86a; --gold2:#e9d396; --gold3:#b58b3a;
  --overlay:rgba(35,24,18,.45); --ring:rgba(167,122,113,.28);
}
#guest-modal-overlay{
  position:fixed; inset:0; display:none; align-items:center; justify-content:center;
  background:var(--overlay); backdrop-filter:blur(2px); z-index:9999; padding:16px;
}
#guest-modal-overlay[aria-hidden="false"]{ display:flex; }

#guest-modal{
  position:relative;
  width:min(520px, 100%);
  max-height:min(90svh, 720px);
  overflow:auto; overflow-x:hidden;  /* 👈 sin scroll horizontal */
  border-radius:20px;
  background:
    linear-gradient(var(--paper), var(--paper)) padding-box,
    linear-gradient(135deg, var(--gold1), var(--gold2) 45%, var(--gold3)) border-box;
  border:2px solid transparent;
  color:var(--ink);
  box-shadow:0 10px 30px rgba(0,0,0,.22), 0 0 0 1px rgba(255,255,255,.6) inset;
  padding:14px;                 /* margen exterior */
  animation:modalIn .22s ease-out;
}

/* capa de contenido con padding uniforme a izquierda/derecha */
.gm-content{ position:relative; z-index:1; padding:6px 16px 14px; }
#guest-modal, #guest-modal *{ font-size:16px; line-height:1.25; box-sizing:border-box; }

#guest-close{
  position:absolute; top:10px; right:10px; border:none; background:transparent;
  font-size:28px; line-height:1; cursor:pointer; color:var(--rose); z-index:2;
}

#guest-modal-title{ margin: 2px 36px 6px 2px; font-weight:700; letter-spacing:.4px; }
#guest-desc{ margin:0 2px 12px 2px; opacity:.9; }

/* Decoraciones */
.gm-decor{
  position:absolute; pointer-events:none; user-select:none; opacity:.9;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,.12));
}
.gm-decor.tl{ top:-14px; left:-8px; width:120px; max-width:40%; transform:rotate(6deg); }
.gm-decor.tr{ top:-18px; right:-10px; width:120px; max-width:40%; transform:rotate(-6deg); }
.gm-decor.bc{ bottom:-18px; left:50%; transform:translateX(-50%); width:180px; max-width:70%; }
.gm-decor.rc{ right:-12px; top:50%; transform:translateY(-50%) rotate(-2deg); width:110px; max-width:34%; }
.gm-decor.lc{ left:-12px; top:50%; transform:translateY(-50%) rotate(2deg); width:110px; max-width:34%; }

/* Formulario */
.field{ margin:12px 0; }
.field label{ display:block; margin-bottom:6px; font-weight:600; letter-spacing:.2px; }
.field input, .field textarea{
  width:100%; padding:12px; border-radius:12px; border:1px solid #d8cfc8;
  background:#fff; color:var(--ink); outline:none;
  box-shadow:0 0 0 0 rgba(0,0,0,0);
  transition: box-shadow .15s ease, border-color .15s ease, background .15s ease;
}
.field textarea{ resize:vertical; }
.field input:focus, .field textarea:focus{
  border-color:var(--rose); box-shadow:0 0 0 4px var(--ring); background:#fffefd;
}
.err{ display:block; color:#c02626; margin-top:6px; min-height:1.2em; }

.actions{ display:flex; gap:10px; justify-content:flex-end; margin-top:10px; }

.btn-gold{
  appearance:none; cursor:pointer; border-radius:999px; border:2px solid transparent;
  padding:10px 16px; color:#2b1d12; font-weight:700; letter-spacing:.2px;
  background:
    linear-gradient(#fff2cc, #ffeeb3) padding-box,
    linear-gradient(135deg, var(--gold1), var(--gold2) 50%, var(--gold3)) border-box;
  box-shadow:0 2px 0 rgba(0,0,0,.05), 0 6px 16px rgba(202,168,106,.35);
  transition: transform .06s ease, box-shadow .2s ease, filter .2s ease;
}
.btn-gold:hover{ filter:saturate(1.05); box-shadow:0 3px 0 rgba(0,0,0,.06), 0 8px 20px rgba(202,168,106,.45); }
.btn-gold:active{ transform:translateY(1px); }
.btn-gold[disabled]{ opacity:.7; cursor:progress; }

.btn-ghost{
  appearance:none; cursor:pointer; border-radius:999px;
  padding:10px 16px; background:transparent; color:var(--rose);
  border:2px solid var(--rose);
}

#guest-status{ margin-top:10px; min-height:1.2em; }
body.modal-open{ overflow:hidden; touch-action:none; }

@keyframes modalIn{
  from{ transform:translateY(6px) scale(.98); opacity:0; }
  to{ transform:translateY(0) scale(1); opacity:1; }
}
`;
    document.head.appendChild(style);
  }

  // ===== DOM =====
  const overlay = document.createElement('div');
  overlay.id = 'guest-modal-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  overlay.innerHTML = `
  <div id="guest-modal" role="dialog" aria-modal="true" aria-labelledby="guest-modal-title">
    <button id="guest-close" aria-label="Cerrar">×</button>

    ${decorTopLeftSrc ? `<img class="gm-decor tl" alt="" aria-hidden="true" src="${decorTopLeftSrc}">` : ``}
    ${decorTopRightSrc ? `<img class="gm-decor tr" alt="" aria-hidden="true" src="${decorTopRightSrc}">` : ``}
    ${decorBottomCenterSrc ? `<img class="gm-decor bc" alt="" aria-hidden="true" src="${decorBottomCenterSrc}">` : ``}
    ${decorRightCenterSrc ? `<img class="gm-decor rc" alt="" aria-hidden="true" src="${decorRightCenterSrc}">` : ``}
    ${decorLeftCenterSrc ? `<img class="gm-decor lc" alt="" aria-hidden="true" src="${decorLeftCenterSrc}">` : ``}

    <div class="gm-content">
      <h2 id="guest-modal-title">${title}</h2>
      <p id="guest-desc">${description}</p>

      <form id="guest-form" novalidate>
        <div class="field">
          <label for="guest-name">Nombre</label>
          <input id="guest-name" name="name" type="text" required autocomplete="name" maxlength="120" />
          <span class="err" data-for="name"></span>
        </div>
        <div class="field">
          <label for="guest-number">Número de personas</label>
          <input id="guest-number" name="number" type="number" inputmode="numeric" min="1" max="50" required />
          <span class="err" data-for="number"></span>
        </div>
        <div class="field">
          <label for="guest-message">Mensaje (opcional)</label>
          <textarea id="guest-message" name="message" rows="4" maxlength="500" placeholder="¿Algo que debamos saber?"></textarea>
          <span class="err" data-for="message"></span>
        </div>

        <input type="hidden" id="guest-token" name="token" value="">
        <div class="actions">
          <button type="button" class="btn-ghost" id="guest-cancel">Cancelar</button>
          <button type="submit" class="btn-gold"  id="guest-submit">Enviar</button>
        </div>
        <div id="guest-status" role="status" aria-live="polite"></div>
      </form>
    </div>
  </div>
  `;
  document.body.appendChild(overlay);

  // ===== Refs & helpers =====
  const closeBtn  = overlay.querySelector('#guest-close');
  const form      = overlay.querySelector('#guest-form');
  const submitBtn = overlay.querySelector('#guest-submit');
  const statusEl  = overlay.querySelector('#guest-status');
  const nameEl    = overlay.querySelector('#guest-name');
  const numEl     = overlay.querySelector('#guest-number');
  const msgEl     = overlay.querySelector('#guest-message');

  function onEsc(e){ if(e.key === 'Escape') close(); }
  function open(){
    overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    setTimeout(()=>nameEl.focus(),0);
    document.addEventListener('keydown', onEsc);
  }
  function close(){
    overlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onEsc);
    statusEl.textContent = '';
    form.reset();
  }
  overlay.addEventListener('click', (e)=>{ if(e.target === overlay) close(); });
  closeBtn.addEventListener('click', close);
  overlay.querySelector('#guest-cancel').addEventListener('click', close);

  function setError(n, msg){ const el = form.querySelector('.err[data-for="'+n+'"]'); if(el) el.textContent = msg || ''; }
  function validate(){
    let ok = true; setError('name',''); setError('number','');
    if(!nameEl.value.trim()){ setError('name','Escribe tu nombre.'); ok=false; }
    const n = Number(numEl.value); if(!n || n<1 || n>50){ setError('number','Ingresa un número entre 1 y 50.'); ok=false; }
    return ok;
  }

  form.addEventListener('submit', async (e)=>{
    e.preventDefault(); if(!validate()) return;
    submitBtn.disabled = true; statusEl.textContent = 'Enviando…';

    const fd = new FormData();
    fd.append('name',   nameEl.value.trim().slice(0,120));
    fd.append('number', String(Number(numEl.value)));
    fd.append('message',(msgEl.value || '').trim().slice(0,500));
    // fd.append('token', document.getElementById('guest-token').value);

    try{
      await fetch("https://script.google.com/macros/s/AKfycbzVjUhSVbfHML1UB4GD_4_CjLc5HpDPIOHhl2q0X1QqSKr-Bpe7EkDM0l6cO58QA4gH/exec", { method:'POST', body: fd, mode:'no-cors' });
      statusEl.textContent = '¡Gracias! Tu registro quedó guardado.';
      setTimeout(close, 900);
    }catch(err){
      statusEl.textContent = 'Fallo de red: ' + err.message;
    }finally{
      submitBtn.disabled = false;
    }
  });

  return { open, close, node: overlay };
}
