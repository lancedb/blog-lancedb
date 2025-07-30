document.addEventListener("DOMContentLoaded", () => {
  (() => {
    const logos = document.querySelector(".js-logos");
    if (logos) {
      const logosItems = logos.querySelectorAll(".logos__item");
      const speed = logos.dataset.sliderSpeed;
      const swiperEl = logos.querySelector(".swiper");

      let isAutoplayRunning = false;

      const swiper = new Swiper(swiperEl, {
        slidesPerView: "auto",
        spaceBetween: 0,
        loop: true,
        loopAdditionalSlides: 1,
        centerInsufficientSlides: true,
        speed: speed,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
        },
      });

      function getTotalSlidesWidth() {
        return Array.from(swiper.slides).reduce((total, slide) => {
          return total + slide.offsetWidth;
        }, 0);
      }

      function checkOverflow() {
        const totalWidth = getTotalSlidesWidth();
        const containerWidth = swiper.width;

        if (totalWidth > containerWidth && !isAutoplayRunning) {
          swiper.autoplay.start();
          isAutoplayRunning = true;
        } else if (totalWidth <= containerWidth && isAutoplayRunning) {
          swiper.autoplay.stop();
          isAutoplayRunning = false;
        }
      }

      checkOverflow();

      window.addEventListener("resize", () => {
        swiper.update();
        checkOverflow();
      });
    }
  })();

  (() => {
    const solution = document.querySelector(".js-solution");
    if (!solution) return;

    const tabs = solution.querySelectorAll(".solution__tab");
    const contents = solution.querySelectorAll(".solution__content-item");
    const thumbs = solution.querySelectorAll(".solution__range-thumb");
    const speed = Number(solution.dataset.speed) + 500;
    if (!tabs.length || !contents.length || !thumbs.length) return;

    let currentTab = tabs[0].dataset.tab;
    let intervalId = null;
    let observer = null;

    function switchTab(tabId) {
      const targetTab = solution.querySelector(`[data-tab="${tabId}"]`);
      const targetContent = solution.querySelector(`[data-content="${tabId}"]`);
      const thumb = targetContent?.querySelector(".solution__range-thumb");

      if (!targetTab || !targetContent || !thumb) return;

      tabs.forEach((tab) => tab.classList.remove("active"));
      contents.forEach((content) => content.classList.remove("active"));
      thumbs.forEach((thumb) => thumb.classList.remove("move"));

      targetTab.classList.add("active");
      targetContent.classList.add("active");
      thumb.classList.add("move");

      currentTab = tabId;
    }

    function getNextTabId() {
      const currentIndex = Array.from(tabs).findIndex(
        (tab) => tab.dataset.tab === currentTab
      );
      const nextIndex = (currentIndex + 1) % tabs.length;
      return tabs[nextIndex].dataset.tab;
    }

    function startAutoRotation() {
      if (intervalId) return;
      intervalId = setInterval(() => {
        switchTab(getNextTabId());
      }, speed);
    }

    function stopAutoRotation() {
      if (!intervalId) return;
      clearInterval(intervalId);
      intervalId = null;

      const activeThumb = solution.querySelector(".solution__range-thumb.move");
      if (activeThumb) activeThumb.classList.remove("move");
    }

    switchTab(currentTab);
    startAutoRotation();

    const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

    function setupObserver() {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!isDesktop()) return; // ❗ Prevent auto rotation on mobile

            if (entry.isIntersecting) {
              switchTab(currentTab);
              startAutoRotation();
            } else {
              stopAutoRotation();
            }
          });
        },
        {
          threshold: 0.3,
        }
      );

      observer.observe(solution);
    }

    if (isDesktop()) {
      setupObserver();
    }

    window.addEventListener("resize", () => {
      window.addEventListener("resize", () => {
        if (!isDesktop()) {
          stopAutoRotation();
        }
      });
    });

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const tabId = tab.dataset.tab;
        if (!tabId) return;

        if (isDesktop()) {
          stopAutoRotation();
          switchTab(tabId);
          startAutoRotation();
        } else {
          switchTab(tabId);
        }
      });
    });
  })();

  // Sliders

  (() => {
    const sliders = document.querySelectorAll(".js-slider");
    if (!sliders) return;
    sliders.forEach((slider) => {
      const swiperEl = slider.querySelector(".swiper");
      const sweperPagination = slider.querySelector(
        ".swiper-pagination"
      );
      const slidesShow = slider.dataset.slidesShow || 1;
  
      const options = {
        slidesPerView: slidesShow,
        breakpoints: {
          576: {
            slidesPerView: 2.2,
          },
          992: {
            slidesPerView: 3,
          },
        },
      };
  
      if (sweperPagination) {
        options.pagination = {
        el: sweperPagination,
        clickable: true,
        type: "bullets",
        };
      }
  
      const swiper = new Swiper(swiperEl, options);
    });
  })();
});
