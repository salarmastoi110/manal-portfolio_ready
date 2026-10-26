'use strict';

/* ========== Helpers ========== */
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const mql = matchMedia('(prefers-reduced-motion: reduce)');
let reduceMotion = mql.matches;
mql.addEventListener('change', e => { reduceMotion = e.matches; });

document.documentElement.classList.add('js-ready');

/* ========== Scroll reveal (staggered) ========== */
$$('[data-stagger]').forEach(group =>
  [...group.children].forEach((el, i) => {
    el.classList.add('reveal');
    el.style.setProperty('--d', `${i * 0.08}s`);
  }));

const revealIO = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add('in');
    revealIO.unobserve(e.target);
  }
}), { threshold: 0.12 });
$$('.reveal').forEach(el => revealIO.observe(el));

/* ========== Navbar ========== */
const nav = $('nav'), toggle = $('navToggle'), links = $('navLinks');
const toggleIcon = toggle.querySelector('i');

const onScroll = () => nav.classList.toggle('scrolled', scrollY > 20);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

function setMenu(open) {
  links.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  if (toggleIcon) toggleIcon.className = open ? 'ri-close-line' : 'ri-menu-line';
}
toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

/* ========== Scrollspy (active nav link) ========== */
const anchors = links.querySelectorAll('a');
const spyIO = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) {
    anchors.forEach(a =>
      a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`));
  }
}), { rootMargin: '-45% 0px -50% 0px' });
$$('#home, main section[id], #contact').forEach(s => spyIO.observe(s));

/* ========== Hero typing effect ========== */
const typed = $('typed');
if (typed && !reduceMotion) {
  let roles;
  try { roles = JSON.parse(typed.dataset.roles); } catch { roles = null; }
  if (Array.isArray(roles) && roles.length) {
    let r = 0, c = 0, del = false;
    (function tick() {
      if (reduceMotion) { typed.textContent = roles[0]; return; }  // stop if motion pref changes
      const w = roles[r];
      typed.textContent = w.slice(0, c);
      if (!del && c === w.length) { del = true; return setTimeout(tick, 1600); }
      if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
      c += del ? -1 : 1;
      setTimeout(tick, del ? 40 : 85);
    })();
  }
}

/* ========== Contact form (mailto with validation) ========== */
const form = $('contactForm');
const status = $('formStatus');
form.addEventListener('submit', e => {
  e.preventDefault();
  if (!form.checkValidity()) {
    status.textContent = 'Please fill in all fields with a valid email.';
    status.classList.add('form__status--error');
    form.reportValidity();
    return;
  }
  const d = new FormData(form);
  status.textContent = 'Opening your email app…';
  status.classList.remove('form__status--error');
  location.href = 'mailto:manalijaz110@gmail.com' +
    '?subject=' + encodeURIComponent(`Portfolio message from ${d.get('name')}`) +
    '&body=' + encodeURIComponent(`${d.get('message')}\n\n${d.get('name')} (${d.get('email')})`);
  form.reset();
});

/* ========== Footer year ========== */
$('year').textContent = new Date().getFullYear();
