document.addEventListener('DOMContentLoaded', function () {
  const toc = document.querySelector('.docs-toc');
  if (!toc) return;
  const links = toc.querySelectorAll('.toc-container a[href^="#"]');
  const headings = Array.from(links).map(link => {
    const id = decodeURIComponent(link.getAttribute('href').slice(1));
    return document.getElementById(id);
  });
    const sidebarCurrent = document.querySelector('.js-current-section');

  // Add click handlers for smooth scrolling with offset
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').slice(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerHeight = 120; // Account for header height
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  function onScroll() {
    let activeIndex = 0;
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
        sidebarCurrent.textContent = link.textContent;
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}); 