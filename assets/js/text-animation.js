gsap.registerPlugin(ScrollTrigger, SplitText);

document.addEventListener("DOMContentLoaded", () => {
  (() => {
    const textElements = document.querySelectorAll(".js-text-animation");
    if (!textElements.length) return;
    
    const splitTexts = textElements.forEach(text => {
      const split = new SplitText(text, {
        type: "lines",
        linesClass: "line"
      });

      gsap.set(split.lines, {
        yPercent: 100,
        opacity: 0
      });

      gsap.to(split.lines, {
        scrollTrigger: {
          trigger: text,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        duration: 1,
        yPercent: 0,
        opacity: 1,
        stagger: 0.2,
        ease: "power3.out",
      });
    });
  })();
});