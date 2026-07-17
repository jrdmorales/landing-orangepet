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
   BRANDS MARQUEE
   ============================================================ */
const brands = ['BAYER','BASF','SYNGENTA','SUMITOMO','DETIA','EFEKTO','BAYER','BASF','SYNGENTA','SUMITOMO','DETIA','EFEKTO'];
const brandsEl = document.getElementById('brandsMarquee');
brands.forEach(b => {
  const s = document.createElement('span');
  s.className = 'brand-item';
  s.textContent = b;
  brandsEl.appendChild(s);
});

/* ============================================================
   STATS
   ============================================================ */
const statsData = [
  { num: '+150', to: 150, pre:'+', suf:'',   dec:0, label:'Hogares protegidos' },
  { num: '+100', to: 100, pre:'+', suf:'',   dec:0, label:'Empresas atendidas' },
  { num: '98%',  to: 98,  pre:'',  suf:'%',  dec:0, label:'Efectividad comprobada' },
  { num: '4.9',  to: 4.9, pre:'',  suf:'/5', dec:1, label:'Valoración promedio' },
  { num: '24h',  to: 24,  pre:'',  suf:'h',  dec:0, label:'Tiempo de respuesta' },
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
   SERVICIOS (3 tarjetas)
   ============================================================ */
const services = [
  { title:'Desratización', desc:'Control profesional de roedores para hogares y empresas.' },
  { title:'Desinsectación', desc:'Control de cucarachas, arañas, hormigas, pulgas y otras plagas.' },
  { title:'Sanitización Ambiental', desc:'Desinfección profesional para proteger hogares, oficinas e industrias.' },
];

const services3Grid = document.getElementById('services3Grid');
services.forEach((s, i) => {
  const card = document.createElement('div');
  card.className = 'service3-card pc-reveal pc-lift';
  const colors = [PIX[i%3], PIX[(i+1)%3], PIX[(i+2)%3], PIX[i%3], PIX[(i+1)%3], PIX[(i+2)%3], PIX[i%3], PIX[(i+1)%3], PIX[(i+2)%3]];
  card.innerHTML =
    `<div class="service3-card__icon">${colors.map(c=>`<div style="background:${c}"></div>`).join('')}</div>` +
    `<div class="service3-card__title">${s.title}</div>` +
    `<div class="service3-card__desc">${s.desc}</div>`;
  services3Grid.appendChild(card);
});

/* ============================================================
   PROCESO
   ============================================================ */
const stepData = [
  { name:'Inspección',  dot:PINK,   detail:'Recorremos cada área de tu propiedad para identificar el tipo de plaga, sus focos y las condiciones que la atraen.' },
  { name:'Diagnóstico', dot:MID,    detail:'Elaboramos un informe con el nivel de infestación, los riesgos y el plan de tratamiento más adecuado para tu caso.' },
  { name:'Tratamiento', dot:PURPLE, detail:'Aplicamos productos certificados con técnicas dirigidas, minimizando el impacto en tus actividades diarias.' },
  { name:'Seguimiento', dot:PINK,   detail:'Programamos visitas de control para verificar los resultados y ajustar el tratamiento cuando es necesario.' },
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
    `<div class="proceso-info__label">PASO ${pad2(activeStep)} / 04</div>
     <div class="proceso-info__title">${st.name}</div>
     <div class="proceso-info__desc">${st.detail}</div>
     <div class="proceso-bars">${bars}</div>`;
}
renderProceso();

/* ============================================================
   REASONS
   ============================================================ */
const reasons = [
  { color:PINK,   title:'Productos autorizados', desc:'Utilizamos únicamente productos aprobados por la normativa sanitaria vigente.' },
  { color:MID,    title:'Técnicos capacitados',  desc:'Personal con formación específica en el manejo seguro de productos fitosanitarios.' },
  { color:PURPLE, title:'Atención rápida',       desc:'Coordinamos visita el mismo día que nos contactas.' },
  { color:PINK,   title:'Seguimiento preventivo',desc:'Visitas de control programadas para evitar que la plaga vuelva a aparecer.' },
  { color:MID,    title:'Planes para empresas',  desc:'Programas de mantención adaptados a cada tipo de negocio.' },
  { color:PURPLE, title:'Cobertura en la Región Metropolitana', desc:'Atendemos hogares, empresas e industrias en toda la Región Metropolitana.' },
];

const reasonsGrid = document.getElementById('reasonsGrid');
reasons.forEach(r => {
  const card = document.createElement('div');
  card.className = 'reason-card pc-reveal';
  card.innerHTML =
    `<div class="reason-card__check" style="color:${r.color}">
       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
     </div>
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
   TESTIMONIALS
   ============================================================ */
const testiData = [
  { quote:'El equipo fue muy responsable. Nos explicaron el proceso, los productos que usarían y nos entregaron el certificado al terminar. Ideal para nuestro restaurante.', author:'María González', role:'Propietaria · Restaurante en Ñuñoa' },
  { quote:'Teníamos una infestación seria de ratas en la bodega y lo resolvieron en dos visitas. Muy profesionales y puntuales. Sin interrumpir la operación.', author:'Roberto Muñoz', role:'Supervisor de Logística · Empresa de Distribución' },
  { quote:'Rápidos y efectivos. Agendamos el mismo día que llamé y resolvieron el problema de cucarachas sin que tuviéramos que cerrar ni un día.', author:'Carmen Vera', role:'Administradora · Edificio Residencial Las Condes' },
  { quote:'Lo que más valoré fue la transparencia: nos mostraron el estado de las trampas, explicaron los resultados y coordinaron seguimiento sin cobro extra.', author:'Felipe Soto', role:'Encargado de Mantención · Planta Industrial' },
  { quote:'Contratamos el servicio para nuestro colegio y fue impecable. Cumplieron la normativa, entregaron toda la documentación y los niños no se enteraron de nada.', author:'Ana Pérez', role:'Directora · Establecimiento Educacional' },
];

let activeTesti = 0;

function renderTesti() {
  const t = testiData[activeTesti];
  document.getElementById('testiQuote').textContent = `"${t.quote}"`;
  document.getElementById('testiName').textContent  = t.author;
  document.getElementById('testiRole').textContent  = t.role;
  const dotsEl = document.getElementById('testiDots');
  dotsEl.innerHTML = '';
  testiData.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'testi-dot' + (i === activeTesti ? ' active' : '');
    btn.setAttribute('aria-label', `Testimonio ${i+1}`);
    btn.addEventListener('click', () => { activeTesti = i; renderTesti(); });
    dotsEl.appendChild(btn);
  });
}
renderTesti();

let testiTimer;
const testiSection = document.getElementById('testimonios');
const testiObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      testiTimer = setInterval(() => { activeTesti = (activeTesti + 1) % testiData.length; renderTesti(); }, 5000);
    } else {
      clearInterval(testiTimer);
    }
  });
}, { threshold: 0.2 });
if (testiSection) testiObserver.observe(testiSection);

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
      btn.textContent = 'Enviar Solicitud';
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
