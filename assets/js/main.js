document.addEventListener("DOMContentLoaded", () => {
  (() => {
    const header = document.querySelector(".js-header");
    const anonncement = document.querySelector(".header__announcement");
    const headerToggle = header.querySelector(".header__toggle");
    
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

    document.addEventListener("resize", () => {
      if (window.innerWidth > 992) {
        header.classList.remove("open");
        document.body.classList.remove("overflow-hidden");
      }
    });

    if (window.scrollY > 0) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    document.addEventListener("scroll", () => {
      if (window.scrollY > 0) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  })();
});
