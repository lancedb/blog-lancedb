document.addEventListener("DOMContentLoaded", () => {
  (() => {
    const logos = document.querySelector(".js-logos");
    if (!logos) return;

    const swiperEl = logos.querySelector(".swiper");
    const speed = logos.dataset.sliderSpeed;

    function getTotalSlidesWidth() {
      return Array.from(swiperEl.querySelectorAll('.swiper-slide')).reduce((total, slide) => {
        return total + slide.offsetWidth;
      }, 0);
    }

    function duplicateSlides() {
      const wrapper = swiperEl.querySelector('.swiper-wrapper');
      const slides = wrapper.querySelectorAll('.swiper-slide');
      
      slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        wrapper.appendChild(clone);
      });
    }

    function initSwiper() {
      const totalWidth = getTotalSlidesWidth();
      const containerWidth = swiperEl.offsetWidth;

      if (totalWidth > containerWidth) {
        // Duplicate slides before initialization
        duplicateSlides();
        
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

        return swiper;
      }

      return null;
    }

    let swiper = initSwiper();

    window.addEventListener("resize", () => {
      if (swiper) {
        swiper.destroy(true, true);
        // Reset slides to original state
        const wrapper = swiperEl.querySelector('.swiper-wrapper');
        const slides = Array.from(wrapper.querySelectorAll('.swiper-slide'));
        const originalSlidesCount = slides.length / 2;
        slides.slice(originalSlidesCount).forEach(slide => slide.remove());
      }
      swiper = initSwiper();
    });
  })();
});
