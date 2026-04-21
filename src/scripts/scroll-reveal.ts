// Reveal elements tagged with `data-animate` when they scroll into view.
// Base styles (opacity 0 + translate) live in src/styles/global.css; this
// script adds the `.visible` class to trigger the CSS transition.

function init(): void {
  const targets = document.querySelectorAll<HTMLElement>('[data-animate]');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}

document.addEventListener('astro:page-load', init);
