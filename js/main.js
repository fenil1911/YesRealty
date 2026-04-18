/* =============================================
   Yes Realty — Animation & Interaction Engine
   ============================================= */

// ── Navbar ──
(() => {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    const setOpen = (open) => {
      toggle.classList.toggle('open', open);
      links.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', () => setOpen(!links.classList.contains('open')));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  }
})();

// ── Active nav link ──
(() => {
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === file || (file === '' && href === 'index.html')) a.classList.add('active');
  });
})();

// ── Text split into chars (grouped by word to avoid mid-word line-breaks) ──
function splitTextIntoChars(el) {
  const text = el.textContent;
  el.innerHTML = '';
  let charIdx = 0;
  const words = text.split(/(\s+)/);
  words.forEach((word) => {
    if (/^\s+$/.test(word)) {
      el.appendChild(document.createTextNode(' '));
      return;
    }
    const wordWrap = document.createElement('span');
    wordWrap.className = 'word';
    word.split('').forEach((ch) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      span.style.transitionDelay = `${charIdx * 28}ms`;
      wordWrap.appendChild(span);
      charIdx++;
    });
    el.appendChild(wordWrap);
  });
}

// ── Scroll animation engine ──
(() => {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-anim], .split-text, .gold-underline').forEach(el => {
      el.classList.add('anim-in');
    });
    return;
  }

  // Standard data-anim elements
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('anim-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('[data-anim]').forEach(el => io.observe(el));

  // Split-text headings
  document.querySelectorAll('.split-text').forEach(el => {
    splitTextIntoChars(el);
  });
  const ioText = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('anim-in');
        ioText.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.split-text').forEach(el => ioText.observe(el));

  // Gold underline
  const ioLine = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('anim-in'); ioLine.unobserve(e.target); }
    });
  }, { threshold: 0.8 });
  document.querySelectorAll('.gold-underline').forEach(el => ioLine.observe(el));
})();

// ── Animated counters ──
(() => {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = easeOutQuart(progress) * target;
      el.textContent = (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
})();

// ── Magnetic buttons ──
(() => {
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width  / 2;
      const y = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
})();

// ── Parallax hero background ──
(() => {
  const bg = document.querySelector('.hero-bg-svg');
  if (!bg) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        bg.style.transform = `translateY(${y * 0.25}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ── Parallax on generic parallax-el ──
(() => {
  const els = document.querySelectorAll('.parallax-el');
  if (!els.length) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        els.forEach(el => {
          const speed = parseFloat(el.dataset.speed || '0.15');
          const r = el.getBoundingClientRect();
          const offset = (sy + r.top + window.scrollY - window.innerHeight / 2);
          el.style.transform = `translateY(${offset * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ── Service expanders ──
(() => {
  document.querySelectorAll('.service-expand').forEach(card => {
    const head = card.querySelector('.service-expand-head');
    if (!head) return;
    head.addEventListener('click', () => {
      const wasOpen = card.classList.contains('open');
      document.querySelectorAll('.service-expand.open').forEach(c => c.classList.remove('open'));
      if (!wasOpen) card.classList.add('open');
    });
  });
})();

// ── Contact form ──
(() => {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  const success = document.querySelector('.form-success');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name  = (data.get('name')  || '').toString().trim();
    const phone = (data.get('phone') || '').toString().trim();
    const req   = (data.get('requirement') || '').toString().trim();
    if (!name || !phone) return;
    const msg = `Hi Yes Realty, I'm ${name}. ${req || 'I would like to discuss a property.'} My number: ${phone}`;
    if (success) { success.classList.add('show'); success.textContent = 'Thank you! Opening WhatsApp to confirm your message…'; }
    setTimeout(() => window.open(`https://wa.me/9376684884?text=${encodeURIComponent(msg)}`, '_blank'), 500);
    form.reset();
  });
})();

