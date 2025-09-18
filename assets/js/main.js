document.addEventListener("DOMContentLoaded", () => {
  (() => {
    const header = document.querySelector(".js-header");
    const anonncement = document.querySelector(".header__announcement");
    const headerToggle = header.querySelector(".header__toggle");
    const headerSearchToggle = header.querySelector(".header__search-toggle");
    const navDropdowns = header.querySelectorAll(".nav__item--has-children");
    const headerHeight = header.offsetHeight;
    document.body.style.setProperty("--header-height", `${headerHeight}px`);
    
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
      document.body.style.setProperty(
        "--header-anonncement-height",
        `${anonncementHeight}px`
      );
  
      anonncementClose.addEventListener("click", () => {
        anonncement.classList.add("closed");
      });
    }

    headerToggle.addEventListener("click", () => {
      const headerHeight = header.offsetHeight;
      document.body.style.setProperty("--header-height", `${headerHeight}px`);
      header.classList.toggle("open");
      document.body.classList.toggle("overflow-hidden");
    });

    if (headerSearchToggle) {
      const searchContainer = header.querySelector(".search-container");
      const searchClose = searchContainer.querySelector(".search-input-close");
      const searchInput = searchContainer.querySelector(".search-input");
      headerSearchToggle.addEventListener("click", () => {
        searchContainer.classList.toggle("show");
        searchInput.focus();
        document.body.classList.add("overflow-hidden");
      });
  
      searchClose.addEventListener("click", () => {
        searchContainer.classList.remove("show");
        document.body.classList.remove("overflow-hidden");
      });
    }

    if (navDropdowns.length) {
      var isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

      navDropdowns.forEach((dropdown) => {
        let hideTimeout;
        const link = dropdown.querySelector(".nav__link");

        // Toggle submenu on click
        link.addEventListener("click", (e) => {
          if (e.target.closest(".nav__caret")) {
            e.preventDefault();
            dropdown.classList.toggle("open");
            const expanded = dropdown.classList.contains("open");
            link.setAttribute("aria-expanded", expanded ? "true" : "false");
          }
        });

        dropdown.addEventListener("mouseenter", () => {
          if (!isDesktop) return;
          clearTimeout(hideTimeout);
          hideTimeout = setTimeout(function () {
            // No-op; CSS hover handles show/hide. This delay gives users time to enter submenu.
          }, 120);
        });
      });
    }

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
      header.classList.toggle('scrolled', window.scrollY !== 0);
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
