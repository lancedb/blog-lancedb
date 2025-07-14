document.addEventListener("DOMContentLoaded", () => {
  (() => {
    const header = document.querySelector(".js-header");
    const anonncement = document.querySelector(".topbar_wrapper");
    const anonncementHeight = anonncement.offsetHeight;
    const headerHeight = header.offsetHeight;
    const headerToggle = header.querySelector(".header__toggle");

    header.style.setProperty("--header-height", `${headerHeight + anonncementHeight}px`);

    headerToggle.addEventListener("click", () => {
      header.classList.toggle("open");
      document.body.classList.toggle("overflow-hidden");
    });

    document.addEventListener("resize", () => {
      if (window.innerWidth > 992) {
        header.classList.remove("open");
        document.body.classList.remove("overflow-hidden");
      }
    });

    document.addEventListener("scroll", () => {
      if (window.scrollY > 0) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
    
  })();
});