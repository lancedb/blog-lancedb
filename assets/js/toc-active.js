document.addEventListener('DOMContentLoaded', function () {
  const toc = document.querySelector('.docs-toc');
  if (!toc) return;
  const links = toc.querySelectorAll('.toc-container a[href^="#"]');
  const headings = Array.from(links).map(link => {
    const id = decodeURIComponent(link.getAttribute('href').slice(1));
    return document.getElementById(id);
  });

  function onScroll() {
    let activeIndex = -1;
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      if (!heading) continue;
      const rect = heading.getBoundingClientRect();
      if (rect.top <= 120) {
        activeIndex = i;
      } else {
        break;
      }
    }
    links.forEach((link, i) => {
      if (i === activeIndex) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}); 