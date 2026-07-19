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

    // Close menu when clicking outside header
    document.addEventListener('click', function (e) {
      if (header.classList.contains('nav-open') &&
          !header.contains(e.target)) {
        header.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();

/* ===== BANNER SLIDESHOW ===== */
(function () {
  var slides = document.querySelectorAll('.rat-banner .slide');
  var dots = document.querySelectorAll('#bannerDots span');
  var i = 0, timer;

  if (!slides.length) return;

  function mostrar(n) {
    slides[i].classList.remove('active'); dots[i].classList.remove('active');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('active'); dots[i].classList.add('active');
  }

  window.moveSlide = function (d) { mostrar(i + d); reiniciar(); };

  dots.forEach(function (d, idx) {
    d.addEventListener('click', function () { mostrar(idx); reiniciar(); });
  });

  function reiniciar() {
    clearInterval(timer);
    timer = setInterval(function () { mostrar(i + 1); }, 6000);
  }

  reiniciar();
})();
