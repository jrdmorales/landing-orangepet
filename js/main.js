/* ===== HAMBURGER MENU ===== */
(function () {
  var hamburger = document.querySelector('.hamburger');
  var header = document.querySelector('header');
  var navLinks = document.querySelectorAll('nav a');

  if (hamburger && header) {
    hamburger.addEventListener('click', function () {
      header.classList.toggle('nav-open');
      var expanded = header.classList.contains('nav-open');
      hamburger.setAttribute('aria-expanded', expanded);
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (e) {
      if (header.classList.contains('nav-open') &&
          !header.contains(e.target)) {
        header.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();

/* ===== NAV DROPDOWNS ===== */
(function () {
  var btns = document.querySelectorAll('.nav-drop-btn');

  btns.forEach(function (btn) {
    var menu = btn.nextElementSibling;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = btn.classList.contains('open');
      // close all
      btns.forEach(function (b) {
        b.classList.remove('open');
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        menu.classList.add('open');
      }
    });
  });

  // close on outside click
  document.addEventListener('click', function () {
    btns.forEach(function (b) {
      b.classList.remove('open');
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });
  });

  // close when a dropdown link is clicked
  document.querySelectorAll('.nav-drop-menu a').forEach(function (a) {
    a.addEventListener('click', function () {
      btns.forEach(function (b) {
        b.classList.remove('open');
        b.nextElementSibling.classList.remove('open');
      });
    });
  });
})();

/* ===== BANNER SLIDESHOW ===== */
(function () {
  var slides = document.querySelectorAll('.rat-banner .slide');
  var dots   = document.querySelectorAll('#bannerDots span');
  var current = 0, timer, animating = false;

  if (!slides.length) return;

  function mostrar(n) {
    if (animating) return;
    animating = true;
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    setTimeout(function () { animating = false; }, 600);
  }

  window.moveSlide = function (d) { mostrar(current + d); reiniciar(); };

  dots.forEach(function (d, idx) {
    d.addEventListener('click', function () { mostrar(idx); reiniciar(); });
  });

  function reiniciar() {
    clearInterval(timer);
    timer = setInterval(function () { mostrar(current + 1); }, 6000);
  }

  reiniciar();
})();



/* ===== TESTIMONIOS CAROUSEL ===== */
(function () {
  function init() {
    var track  = document.querySelector('.test-track');
    var wrap   = document.querySelector('.test-cards');
    var dots   = document.querySelectorAll('#tcDots span');
    if (!track || !wrap) return;

    var originals = Array.from(track.children);
    var total   = originals.length; // 5
    var visible = window.innerWidth <= 640 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    var gap     = 14;

    // Prepend clones of last 3, append clones of first 3
    originals.slice(-visible).forEach(function(c){
      track.insertBefore(c.cloneNode(true), track.firstChild);
    });
    originals.slice(0, visible).forEach(function(c){
      track.appendChild(c.cloneNode(true));
    });

    // Compute card width from the track container so it's always precise
    var containerW = wrap.offsetWidth;
    var cardW = Math.floor((containerW - gap * (visible - 1)) / visible);
    var step  = cardW + gap;

    // Apply exact pixel widths to every card in the track
    Array.from(track.children).forEach(function(c){ c.style.width = cardW + 'px'; });
    var idx   = 0; // logical 0-4
    var busy  = false;

    // Position at first real card (skip the 3 prepended clones)
    track.style.transition = 'none';
    track.style.transform  = 'translateX(-' + (visible * step) + 'px)';

    function updateDots() {
      dots.forEach(function(d, i){ d.classList.toggle('active', i === idx); });
    }

    function move(dir) {
      if (busy) return;
      busy = true;
      var newLogical = idx + dir;
      var rawPos     = (visible + newLogical) * step;
      track.style.transition = 'transform .45s ease';
      track.style.transform  = 'translateX(-' + rawPos + 'px)';
      idx = ((newLogical % total) + total) % total;
      updateDots();

      track.addEventListener('transitionend', function onEnd() {
        track.removeEventListener('transitionend', onEnd);
        // Snap: if we animated into a clone zone, jump to the equivalent real position
        var realPos = (visible + idx) * step;
        if (rawPos !== realPos) {
          track.style.transition = 'none';
          track.style.transform  = 'translateX(-' + realPos + 'px)';
        }
        busy = false;
      });
    }

    dots.forEach(function(d, i){
      d.addEventListener('click', function(){
        if (i !== idx) { move(i - idx); resetTimer(); }
      });
    });

    var timer;
    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(function(){ move(1); }, 5000);
    }
    resetTimer();
    updateDots();
  }

  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();

/* ===== STATS COUNT ANIMATION ===== */
(function () {
  var items = document.querySelectorAll('.stats-bar .stat-item .num');
  if (!items.length || !window.IntersectionObserver) return;

  // Parse the raw number out of strings like "+1.000", "+250", "98%", "24/7"
  function parseNum(txt) {
    if (txt.indexOf('/') !== -1) return null; // 24/7 — skip
    return parseInt(txt.replace(/[^0-9]/g, ''), 10) || 0;
  }

  function formatNum(original, val) {
    var hasDot = original.indexOf('.') !== -1 && val >= 1000;
    var str = hasDot
      ? val.toLocaleString('es-CL')   // 1.000 style
      : String(val);
    if (original.charAt(0) === '+') str = '+' + str;
    if (original.indexOf('%') !== -1)  str = str + '%';
    return str;
  }

  function countUp(el, target, original) {
    var start = null, duration = 3200;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = formatNum(original, Math.round(eased * target));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = original;
    }
    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var original = el.dataset.original;
      var target = parseNum(original);
      if (target !== null) countUp(el, target, original);
      observer.unobserve(el);
    });
  }, { threshold: 0.6 });

  items.forEach(function (el) {
    el.dataset.original = el.textContent;
    observer.observe(el);
  });
})();
