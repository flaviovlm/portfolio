/* ============================================================
   FLÁVIO VIEIRA LIMA — PORTFOLIO · script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV SCROLL EFFECT ──────────────────────────────────────
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── MOBILE HAMBURGER ───────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  // ── DARK / LIGHT TOGGLE ────────────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('fvl-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('fvl-theme', next);
  });

  // ── SCROLL REVEAL ──────────────────────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate skill bars when section becomes visible
        const bars = entry.target.querySelectorAll('.skill-fill[data-level]');
        bars.forEach(bar => {
          bar.style.width = bar.dataset.level + '%';
        });
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Also observe skill bars directly within section
  const skillsSection = document.getElementById('habilidades');
  if (skillsSection) {
    const skillObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-fill[data-level]').forEach(bar => {
            setTimeout(() => {
              bar.style.width = bar.dataset.level + '%';
            }, 200);
          });
        }
      });
    }, { threshold: 0.2 });
    skillObs.observe(skillsSection);
  }

  // ── ACTIVE NAV LINK ────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  // ── CONTACT FORM ───────────────────────────────────────────
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = form.nome.value.trim();
      const email = form.email.value.trim();
      const mensagem = form.mensagem.value.trim();

      if (!nome || !email || !mensagem) {
        note.textContent = 'Preencha os campos obrigatórios.';
        note.className = 'form-note error';
        return;
      }

      // Open Gmail web compose
      const assunto = form.assunto.value.trim() || 'Contato pelo portfólio';
      const body = `Olá Flávio,\n\n${mensagem}\n\n—\n${nome}\n${email}`;
      const gmailUrl = `https://mail.google.com/mail/u/0/?view=cm&to=flaviovieira.lm@gmail.com&su=${encodeURIComponent(assunto)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, '_blank', 'noopener');

      note.textContent = 'Gmail aberto em nova aba. Só enviar!';
      note.className = 'form-note success';

      setTimeout(() => {
        form.reset();
        note.textContent = '';
        note.className = 'form-note';
      }, 5000);
    });
  }

  // ── SMOOTH ANCHOR SCROLL ──────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 64;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── HERO PARALLAX (subtle) ─────────────────────────────────
  const heroBg = document.querySelector('.hero-bg-text');
  const heroOrnament = document.querySelector('.hero-ornament');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBg.style.transform = `translate(-50%, calc(-50% + ${y * 0.15}px))`;
      if (heroOrnament) {
        heroOrnament.style.transform = `translateY(calc(-50% + ${y * 0.08}px))`;
      }
    }, { passive: true });
  }

  // ── CURSOR TRAIL (desktop only) ────────────────────────────
  if (window.matchMedia('(pointer: fine)').matches) {
    const trail = document.createElement('div');
    trail.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: 6px; height: 6px; border-radius: 50%;
      background: rgba(192, 57, 43, 0.5);
      transform: translate(-50%, -50%);
      transition: opacity 0.5s ease;
      opacity: 0;
    `;
    document.body.appendChild(trail);

    let mx = 0, my = 0;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      trail.style.opacity = '1';
      trail.style.left = mx + 'px';
      trail.style.top = my + 'px';
    });
    document.addEventListener('mouseleave', () => { trail.style.opacity = '0'; });
  }

  // ── INITIAL HERO REVEAL ────────────────────────────────────
  // Trigger hero reveals immediately (they're in view on load)
  requestAnimationFrame(() => {
    document.querySelectorAll('#hero .reveal').forEach(el => {
      el.classList.add('visible');
    });
  });

});