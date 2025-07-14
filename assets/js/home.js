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
        }
      });

      // Calculate total width of all slides
      function getTotalSlidesWidth() {
        return Array.from(swiper.slides).reduce((total, slide) => {
          return total + slide.offsetWidth;
        }, 0);
      }

      // Check if slides overflow container and control autoplay
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

      // Initial check
      checkOverflow();

      // Check on resize
      window.addEventListener("resize", () => {
        swiper.update();
        checkOverflow();
      });
    }
  })();
});
