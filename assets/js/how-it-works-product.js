gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);
document.addEventListener("DOMContentLoaded", () => {
  // How it works animation
  (() => {
    const howItWorksSections = document.querySelector(".js-how-it-works");
    console.log(howItWorksSections);

    if (!howItWorksSections) return;
    const items = howItWorksSections.querySelectorAll('.js-how-it-works-wrapper');

    items.forEach(section => {
      const listItems = section.querySelectorAll('.js-how-it-works-item');
      const listLine = section.querySelector('.js-how-it-works-line');
      
      const firstItem = listItems[0];
      const lastItem = listItems[listItems.length - 1];
      
      // Line animation that follows scroll
      gsap.fromTo(listLine,
        { height: 0 },
        {
          height: "70%",
          ease: "none",
          scrollTrigger: {
            trigger: firstItem,
            endTrigger: lastItem,
            start: "top 85%",
            end: "top 85%",
            scrub: true
          }
        }
      );

      // Individual item animations
      listItems.forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          x: "20px",
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      });
    });
  })();
});
