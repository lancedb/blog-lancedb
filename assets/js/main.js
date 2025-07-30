document.addEventListener("DOMContentLoaded", () => {
  (() => {
    const header = document.querySelector(".js-header");
    const anonncement = document.querySelector(".header__announcement");
    const headerToggle = header.querySelector(".header__toggle");
    const debounce = (fn, delay) => {
      let timeoutId;
      return (...args) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          fn.apply(null, args);
        }, delay);
      };
    };
    if (anonncement) {
      const anonncementClose = anonncement.querySelector(
        ".header__announcement-close"
      );
      const anonncementHeight = anonncement.offsetHeight;
      header.style.setProperty(
        "--header-anonncement-height",
        `${anonncementHeight}px`
      );
  
      anonncementClose.addEventListener("click", () => {
        anonncement.classList.add("closed");
      });
    }

    headerToggle.addEventListener("click", () => {
      const headerHeight = header.offsetHeight;
      header.style.setProperty("--header-height", `${headerHeight}px`);
      header.classList.toggle("open");
      document.body.classList.toggle("overflow-hidden");
    });

   // Debounced resize handler
    const handleResize = debounce(() => {
      if (window.innerWidth > 992) {
        header.classList.remove("open");
        document.body.classList.remove("overflow-hidden");
      }
    }, 150);

    document.addEventListener("resize", handleResize);

    // Debounced scroll handler
    const handleScroll = debounce(() => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, 10);

    document.addEventListener('scroll', handleScroll);
    handleScroll();
  })();

  // Scroll to section
  (() => {
    const scrollButtons = document.querySelectorAll(".js-scroll-to-section");
    if (!scrollButtons.length) return;

    const scrollToSection = (target) => {
      const section = document.querySelector(`[data-scroll="${target}"]`);
      if (!section) return;

      window.scrollTo({
        top: section.offsetTop,
        behavior: "smooth"
      });
    };

    scrollButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const target = button.dataset.scrollTo;
        scrollToSection(target);
      });
    });
  })();
});
