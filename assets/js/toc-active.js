document.addEventListener("DOMContentLoaded", function () {
  const toc = document.querySelector(".toc-container");
  if (!toc) return;
  const links = toc.querySelectorAll('a[href^="#"]');
  const headings = Array.from(links).map((link) => {
    const id = decodeURIComponent(link.getAttribute("href").slice(1));
    return document.getElementById(id);
  });
  const sidebarCurrent = document.querySelector(".js-current-section");
  const headerHeight = 120; // Adjust this value based on your header's height

  if (window.location.hash) {
    const targetId = decodeURIComponent(window.location.hash.slice(1));
    debounce(scrollToTarget(targetId), 20)();
  }

  // Add click handlers for smooth scrolling with offset
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      history.replaceState(null, "", this.getAttribute("href"));
      const targetId = this.getAttribute("href").slice(1);

      debounce(scrollToTarget(targetId), 20)();
    });
  });

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function scrollToTarget(targetId, offset = headerHeight) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const targetPosition = targetElement.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  }

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
        link.classList.add("active");
        sidebarCurrent.textContent = link.textContent;
      } else {
        link.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
