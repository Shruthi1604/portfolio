/* ============================================================
   SHRUTHI SANKARANARAYANAN — Portfolio Script
   Smooth-scroll nav · Scroll-spy · Hamburger menu
   ============================================================ */

(function () {
  'use strict';

  /* ---- Smooth scroll for all anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      /* Close mobile overlay if open */
      closeOverlay();
    });
  });

  /* ---- Scroll-spy via IntersectionObserver ---- */
  var navLinks      = document.querySelectorAll('.nav-links a[data-section]');
  var overlayLinks  = document.querySelectorAll('.overlay-links a[data-section]');
  var sections      = document.querySelectorAll('section[id]');

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          setActive(id);
        }
      });
    },
    {
      rootMargin: '-50% 0px -50% 0px', /* trigger when section crosses vertical midpoint */
      threshold: 0
    }
  );

  sections.forEach(function (s) { observer.observe(s); });

  function setActive(id) {
    [navLinks, overlayLinks].forEach(function (set) {
      set.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('data-section') === id);
      });
    });
  }

  /* ---- Hamburger / mobile overlay ---- */
  var hamburger = document.getElementById('nav-hamburger');
  var overlay   = document.getElementById('nav-overlay');

  function openOverlay() {
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeOverlay() {
    overlay.classList.remove('open');
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      var isOpen = overlay.classList.contains('open');
      isOpen ? closeOverlay() : openOverlay();
    });
  }

  /* Close overlay on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeOverlay();
  });

  /* ---- Slideshows ----
     Initialises every .slideshow element independently. Each one
     wires up its own prev/next/dots/counter via class selectors. */
  (function initSlideshows() {
    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    function initOne(slideshow) {
      var slides   = slideshow.querySelectorAll('.slide');
      var prevBtn  = slideshow.querySelector('.slide-arrow.prev');
      var nextBtn  = slideshow.querySelector('.slide-arrow.next');
      var counter  = slideshow.querySelector('.slide-counter');
      var dotsWrap = slideshow.querySelector('.slide-dots');
      if (!slides.length || !prevBtn || !nextBtn) return;

      var current = 0;
      var total   = slides.length;

      /* Build dots */
      for (var i = 0; i < total; i++) {
        var d = document.createElement('button');
        d.className = 'slide-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        d.setAttribute('data-idx', i);
        d.addEventListener('click', function (e) {
          go(parseInt(e.currentTarget.getAttribute('data-idx'), 10));
        });
        dotsWrap.appendChild(d);
      }
      var dots = dotsWrap.querySelectorAll('.slide-dot');

      /* When a slide becomes active, eagerly load any GIF/img inside it
         (lazy-loaded images otherwise don't fire reliably inside the
         opacity-fade stack). */
      function ensureLoaded(slide) {
        slide.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
          img.loading = 'eager';
          if (!img.complete) {
            var src = img.src;
            img.src = '';
            img.src = src;
          }
        });
      }

      function go(idx) {
        if (idx < 0 || idx >= total || idx === current) {
          prevBtn.disabled = current === 0;
          nextBtn.disabled = current === total - 1;
          return;
        }
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = idx;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
        ensureLoaded(slides[current]);
        counter.textContent = pad(current + 1) + ' / ' + pad(total);
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === total - 1;
      }

      /* Also preload the first slide */
      ensureLoaded(slides[0]);

      prevBtn.addEventListener('click', function () { go(current - 1); });
      nextBtn.addEventListener('click', function () { go(current + 1); });

      /* Keyboard nav — only when THIS slideshow is in view */
      document.addEventListener('keydown', function (e) {
        var rect = slideshow.getBoundingClientRect();
        var inView = rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2;
        if (!inView) return;
        if (e.key === 'ArrowLeft')  { go(current - 1); }
        if (e.key === 'ArrowRight') { go(current + 1); }
      });

      /* Initialise state */
      counter.textContent = pad(1) + ' / ' + pad(total);
      prevBtn.disabled = true;
    }

    document.querySelectorAll('.slideshow').forEach(initOne);
  })();

  /* ---- Live date in hero ---- */
  var dateEl = document.getElementById('hero-date');
  if (dateEl) {
    var now = new Date();
    var formatted = now.toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    }).replace(/ /g, ' '); /* keeps "01 Jun 2026" style */
    dateEl.textContent = formatted;
  }

})();
