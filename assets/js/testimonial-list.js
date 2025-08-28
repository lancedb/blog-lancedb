document.addEventListener("DOMContentLoaded", function () {
  const testimonialList = document.querySelector(".js-testimonial-list");
  if (!testimonialList) return;
  const pagination = testimonialList.querySelector(".testimonial-list__pagination");
  const swiperEl = testimonialList.querySelector(".swiper");
  const swiper = new Swiper(swiperEl, {
    slidesPerView: "auto",
    pagination: {
      el: pagination,
      clickable: true,
    },
  });
});
