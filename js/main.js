'use strict';

/* ============================================================
   COLOR PALETTE — Calido
   ============================================================ */
const STOPS = [[245,124,0],[255,152,0],[230,81,0]];

function col(t, stops) {
  const [a, b, f] = t < 0.5
    ? [stops[0], stops[1], t * 2]
    : [stops[1], stops[2], (t - 0.5) * 2];
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * f));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

const PINK   = col(0,   STOPS);
const MID    = col(0.5, STOPS);
const PURPLE = col(1,   STOPS);
const PIX    = [PINK, MID, PURPLE];

/* ============================================================
   LOGO GRIDS
   ============================================================ */
function buildLogoGrid(el) {
  [0,1,2, 1,2,0, 2,0,1].forEach(i => {
    const d = document.createElement('div');
    d.style.background = PIX[i];
    el.appendChild(d);
  });
}
buildLogoGrid(document.getElementById('logoGrid'));
buildLogoGrid(document.getElementById('footerLogoGrid'));

/* ============================================================
   HERO BLOCKS
   ============================================================ */
(function buildHero() {
  const container = document.getElementById('heroBlocks');
  const cols = 26, rows = 12;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const center = (c / cols) * (rows * 0.62) + 2;
      const n = Math.abs(Math.sin(c * 12.9898 + r * 78.233) * 43758.5453) % 1;
      const thick = 1.5 + 2.3 * n;
      if (Math.abs(r - center) < thick && n > 0.24) {
        const el = document.createElement('div');
        el.style.cssText =
          `grid-column:${c+1};grid-row:${r+1};background:${col(c/(cols-1),STOPS)};` +
          `border-radius:2px;animation:pcPop .5s cubic-bezier(.2,1.4,.4,1) both;` +
          `animation-delay:${c*22+r*8}ms`;
        container.appendChild(el);
      }
    }
  }
})();

/* ============================================================
   PIXEL ART CREATURES
   ============================================================ */
function buildCreature(container, bitmap, color) {
  const cols = bitmap[0].length;
  const grid = document.createElement('div');
  grid.className = 'pixel-art';
  grid.style.gridTemplateColumns = `repeat(${cols},1fr)`;
  grid.style.width = `${cols * 11}px`;
  bitmap.forEach(row => {
    [...row].forEach(ch => {
      const d = document.createElement('div');
      d.style.cssText = `background:${ch==='1'?color:'transparent'};aspect-ratio:1;border-radius:1px`;
      grid.appendChild(d);
    });
  });
  container.appendChild(grid);
}

buildCreature(document.getElementById('roachArt'), [
  '00100000100','00010001000','00111111100','01101110110',
  '11111111111','10111111101','10100000101','00011011000'
], PINK);

buildCreature(document.getElementById('ratArt'), [
  '00100000100','10010001001','10111111101','11100111011',
  '11111111111','01111111110','00100000100','01000000010'
], PURPLE);

/* ============================================================
   STATS
   ============================================================ */
const statsData = [
  { num: '+150', to: 150, pre:'+', suf:'',  dec:0, label:'Hogares protegidos' },
  { num: '+100', to: 100, pre:'+', suf:'',  dec:0, label:'Empresas atendidas' },
  { num: '98%',  to: 98,  pre:'',  suf:'%', dec:0, label:'Efectividad comprobada' },
  { num: '24h',  to: 24,  pre:'',  suf:'h', dec:0, label:'Tiempo de respuesta' },
];

const statsGrid = document.getElementById('statsGrid');
statsData.forEach(s => {
  const div = document.createElement('div');
  div.className = 'stat-item';
  div.innerHTML =
    `<div class="stat-num pc-count" data-to="${s.to}" data-pre="${s.pre}" data-suf="${s.suf}" data-dec="${s.dec}">${s.num}</div>` +
    `<div class="stat-label">${s.label}</div>`;
  statsGrid.appendChild(div);
});

function animateCount(el) {
  const to  = parseFloat(el.dataset.to)  || 0;
  const pre = el.dataset.pre || '';
  const suf = el.dataset.suf || '';
  const dec = parseInt(el.dataset.dec || '0', 10);
  const dur = 1500, t0 = performance.now();
  (function tick(now) {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = pre + (to * (1 - Math.pow(1-p, 3))).toFixed(dec) + suf;
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

/* ============================================================
   SERVICE GRID
   ============================================================ */
const services = [
  { title:'Desratización Pre-Demolición', desc:'Realizamos el servicio de desratización previo a la demolición, cumpliendo con la normativa vigente y entregando la documentación requerida por la SEREMI de Salud.' },
];

const serviceGrid = document.getElementById('serviceGrid');
services.forEach((s, i) => {
  const card = document.createElement('div');
  card.className = 'service-card pc-reveal pc-lift';
  const colors = [PIX[i%3], PIX[(i+1)%3], PIX[(i+2)%3], PIX[i%3]];
  card.innerHTML =
    `<div class="service-card__icon">${colors.map(c=>`<div style="background:${c}"></div>`).join('')}</div>` +
    `<div class="service-card__body">` +
      `<div class="service-card__title">${s.title}</div>` +
      `<div class="service-card__desc">${s.desc}</div>` +
      `<a href="#contacto" class="service-card__link">Leer más →</a>` +
    `</div>`;
  serviceGrid.appendChild(card);
});

/* ============================================================
   PROCESO
   ============================================================ */
const stepData = [
  { name:'Inspección',  dot:PINK,   detail:'Recorremos cada área de tu propiedad para identificar el tipo de plaga, sus focos y las condiciones que la atraen.' },
  { name:'Diagnóstico', dot:MID,    detail:'Elaboramos un informe con el nivel de infestación, los riesgos y el plan de tratamiento más adecuado para tu caso.' },
  { name:'Tratamiento', dot:PURPLE, detail:'Aplicamos productos certificados con técnicas dirigidas, minimizando el impacto en tus actividades diarias.' },
  { name:'Seguimiento', dot:PINK,   detail:'Programamos visitas de control para verificar los resultados y ajustar el tratamiento cuando es necesario.' },
  { name:'Garantía',    dot:MID,    detail:'Respaldamos nuestro trabajo: si la plaga reaparece dentro del periodo acordado, volvemos sin costo.' },
];

let activeStep = 0;
const pad2 = n => String(n+1).padStart(2,'0');

function renderProceso() {
  const st = stepData[activeStep];

  /* Visual */
  document.getElementById('procesoVisual').innerHTML =
    `<div class="proceso-arch-wrap">
       <div class="proceso-arch"></div>
       <div class="proceso-badge">
         <div class="proceso-badge__inner">
           <div class="proceso-badge__num">${pad2(activeStep)}</div>
           <div class="proceso-badge__name">${st.name}</div>
         </div>
       </div>
     </div>
     <div class="proceso-chips" id="procesoChips"></div>`;

  stepData.forEach((s, i) => {
    const btn = document.createElement('button');
    btn.className = 'proceso-chip' + (i === activeStep ? ' active' : '');
    btn.innerHTML = `<span class="proceso-chip__dot" style="background:${s.dot}"></span>${s.name}`;
    btn.addEventListener('click', () => { activeStep = i; renderProceso(); });
    document.getElementById('procesoChips').appendChild(btn);
  });

  /* Info */
  const bars = stepData.map((s,i) =>
    `<div class="proceso-bar" style="flex:0 0 ${i===activeStep?'32px':'14px'};background:${i===activeStep?s.dot:'rgba(0,0,0,.12)'}"></div>`
  ).join('');

  document.getElementById('procesoInfo').innerHTML =
    `<div class="proceso-info__label">PASO ${pad2(activeStep)} / 05</div>
     <div class="proceso-info__title">${st.name}</div>
     <div class="proceso-info__desc">${st.detail}</div>
     <div class="proceso-bars">${bars}</div>`;
}
renderProceso();

/* ============================================================
   REASONS
   ============================================================ */
const reasons = [
  { n:'01', color:PINK,   title:'Resolución Sanitaria', desc:'Trabajamos con resolución sanitaria vigente y entregamos el certificado de servicio al finalizar cada trabajo.' },
  { n:'02', color:MID,    title:'Técnicos capacitados',  desc:'Personal con formación específica en el manejo seguro de productos fitosanitarios autorizados.' },
  { n:'03', color:PURPLE, title:'Experiencia comprobada',desc:'Historial comprobado en control de plagas para hogares y empresas en Santiago y alrededores.' },
  { n:'04', color:PINK,   title:'Productos autorizados', desc:'Utilizamos únicamente productos aprobados por la normativa sanitaria vigente.' },
  { n:'05', color:MID,    title:'Respuesta rápida',      desc:'Atención ágil en Santiago y alrededores. Coordinamos visita el mismo día que nos contactas.' },
];

const reasonsGrid = document.getElementById('reasonsGrid');
reasons.forEach(r => {
  const card = document.createElement('div');
  card.className = 'reason-card pc-reveal';
  card.innerHTML =
    `<div class="reason-card__num" style="color:${r.color}">${r.n}</div>
     <div>
       <div class="reason-card__title">${r.title}</div>
       <div class="reason-card__desc">${r.desc}</div>
     </div>`;
  reasonsGrid.appendChild(card);
});

/* ============================================================
   ÁREAS
   ============================================================ */
const areas = [
  { title:'Hogares',      color:PINK,   desc:'Protege a tu familia y mascotas con un servicio de control de plagas seguro y efectivo. Eliminamos la infestación y ayudamos a prevenir su reaparición para mantener tu hogar libre de riesgos.' },
  { title:'Empresas',     color:MID,    desc:'Ayudamos a mantener espacios de trabajo seguros y libres de plagas, ofreciendo soluciones adaptadas a cada tipo de empresa y cumpliendo con la normativa sanitaria vigente.' },
  { title:'Restaurantes', color:PURPLE, desc:'La higiene y el control de plagas son fundamentales para proteger la salud de tus clientes y la reputación de tu negocio. Aplicamos tratamientos eficaces para mantener tu establecimiento en óptimas condiciones.' },
];

const areasGrid = document.getElementById('areasGrid');
areas.forEach(a => {
  const item = document.createElement('div');
  item.className = 'area-card pc-reveal pc-lift';
  item.innerHTML =
    `<div class="area-card__dot" style="background:${a.color}"></div>` +
    `<div class="area-card__title">${a.title}</div>` +
    `<div class="area-card__desc">${a.desc}</div>` +
    `<a href="#contacto" class="btn btn--dark btn--sm area-card__cta">Contáctanos</a>`;
  areasGrid.appendChild(item);
});

/* ============================================================
   CERT BADGE ICONS
   ============================================================ */
(function buildCertIcons() {
  const patterns = [
    [PINK, MID, PURPLE, PINK, MID, PURPLE, PINK, MID, PURPLE],
    [MID, PURPLE, PINK, PURPLE, PINK, MID, PINK, MID, PURPLE],
  ];
  ['certIcon1','certIcon2'].forEach((id, idx) => {
    const el = document.getElementById(id);
    if (!el) return;
    patterns[idx].forEach(bg => {
      const d = document.createElement('div');
      d.style.background = bg;
      el.appendChild(d);
    });
  });
})();

/* ============================================================
   SUCCESS ICON
   ============================================================ */
(function buildSuccessIcon() {
  const el = document.getElementById('successIcon');
  const pattern = ['','rgb(157,182,240)','','rgb(195,163,224)','rgb(240,166,184)','rgb(195,163,224)','','rgb(157,182,240)',''];
  pattern.forEach(bg => {
    const d = document.createElement('div');
    if (bg) d.style.background = bg;
    el.appendChild(d);
  });
})();

/* ============================================================
   CONTACT FORM
   ============================================================ */
document.getElementById('contactForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('[type=submit]');
  btn.disabled = true;
  btn.textContent = 'Enviando…';
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      form.style.display = 'none';
      document.getElementById('contactSuccess').classList.add('visible');
    } else {
      btn.disabled = false;
      btn.textContent = 'Solicitar Cotización';
      alert('Error al enviar. Por favor contáctanos por WhatsApp.');
    }
  } catch {
    btn.disabled = false;
    btn.textContent = 'Solicitar Cotización';
    alert('Sin conexión. Por favor contáctanos por WhatsApp.');
  }
});

/* ============================================================
   HAMBURGER MENU
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ============================================================
   SCROLL REVEAL + COUNTER ANIMATION
   ============================================================ */
const revealEls = [...document.querySelectorAll('.pc-reveal')];

revealEls.forEach(el => {
  const sibs = [...el.parentElement.children].filter(c => c.classList.contains('pc-reveal'));
  el.style.transitionDelay = (Math.min(sibs.indexOf(el), 6) * 70) + 'ms';
});

const revealIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('pc-in'); revealIO.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
revealEls.forEach(el => revealIO.observe(el));

const countIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCount(e.target); countIO.unobserve(e.target); }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.pc-count').forEach(el => countIO.observe(el));
