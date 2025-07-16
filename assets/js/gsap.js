gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  // Animation for Lakehouse
  (() => {
    const lakehouse = document.querySelector(".lakehouse");
    if (!lakehouse) return;
    const lakehouseVector = lakehouse.querySelector(".lakehouse__interact");

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: lakehouse,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    tl.fromTo(
      lakehouseVector,
      {
        xPercent: -100,
        opacity: 0,
        scale: 0.8,
      },
      {
        xPercent: +100,
        opacity: 1,
        scale: 1,
        ease: "none",
      }
    );
  })();

  // Animation for infrastructure section
  (() => {
    const wrapper = document.querySelector(".infrastructure__badges");
    if (!wrapper) return;

    let animations = [];

    const clearAnimations = () => {
      animations.forEach((anim) => anim.kill());
      animations = [];

      const badges = wrapper.querySelectorAll(".button");
      badges.forEach((badge) => {
        gsap.set(badge, {
          clearProps: "all",
        });
      });

      const circles = document.querySelectorAll(".background-circle");
      circles.forEach((circle) => circle.remove());
    };

    const createBackgroundCircles = () => {
      const wrapperRect = wrapper.getBoundingClientRect();
      const circleCount = gsap.utils.random(15, 20, 1);

      for (let i = 0; i < circleCount; i++) {
        const circle = document.createElement("div");
        const size = gsap.utils.random(10, 50);
        const useAccentColor = Math.random() > 0.5;
        const backgroundColor = useAccentColor
          ? "rgba(255, 115, 74, 0.1)"
          : "rgba(74, 69, 66, 0.3)";

        circle.className = "background-circle";
        circle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: ${backgroundColor};
          pointer-events: none;
          z-index: -1;
        `;

        const x = gsap.utils.random(0, wrapperRect.width - size);
        const y = gsap.utils.random(0, wrapperRect.height - size);

        gsap.set(circle, { x, y });
        wrapper.appendChild(circle);

        gsap.to(circle, {
          x: `+=${gsap.utils.random(-20, 20)}`,
          y: `+=${gsap.utils.random(-20, 20)}`,
          scale: gsap.utils.random(0.8, 1.2),
          duration: gsap.utils.random(2, 4),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    };

    const initializeAnimation = () => {
      clearAnimations();

      if (window.innerWidth < 768) {
        return;
      }

      createBackgroundCircles();

      const badges = wrapper.querySelectorAll(".button");
      const wrapperRect = wrapper.getBoundingClientRect();
      const centerX = wrapperRect.width / 2;
      const centerY = wrapperRect.height / 2;
      const radiusX = wrapperRect.width / 2 - 20;
      const radiusY = wrapperRect.height / 2 - 20;
      const duration = 60;

      const svgPath = `M ${centerX + radiusX} ${centerY} 
                       A ${radiusX} ${radiusY} 0 1 1 ${
        centerX - radiusX
      } ${centerY}
                       A ${radiusX} ${radiusY} 0 1 1 ${
        centerX + radiusX
      } ${centerY}`;

      badges.forEach((badge, index) => {
        const startProgress = index / badges.length;
        const angle = startProgress * Math.PI * 2;
        const initialX = centerX + radiusX * Math.cos(angle);
        const initialY = centerY + radiusY * Math.sin(angle);

        gsap.set(badge, {
          x: initialX,
          y: initialY,
          xPercent: -50,
          yPercent: -50,
          transformOrigin: "50% 50%",
        });

        const animation = gsap.to(badge, {
          motionPath: {
            path: svgPath,
            autoRotate: false,
            start: startProgress,
            end: startProgress + 1,
            alignOrigin: [0.5, 0.5],
          },
          duration: duration,
          repeat: -1,
          ease: "linear",
        });

        animations.push(animation);
      });
    };

    initializeAnimation();

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initializeAnimation, 50);
    });
  })();

  // Animation for scale section
  (() => {
    const scale = document.querySelector(".js-scale");
    if (!scale) return;
    const counts = scale.querySelectorAll(".scale__count");
    const lotties = scale.querySelectorAll(".scale__lottie");

    counts.forEach(count => {
      const targetNumber = parseInt(count.dataset.count || '0');
      
      gsap.fromTo(count, {
        textContent: '0',
        snap: { textContent: 1 }
      }, {
        textContent: targetNumber,
        duration: 2,
        ease: "power1.out",
        scrollTrigger: {
          trigger: count,
          start: "top center+=100",
          once: true
        },
        snap: { textContent: 1 }
      });
    });

    lotties.forEach(lottieContainer => {
      const lottieSrc = lottieContainer.dataset.lottie;
      if (!lottieSrc) return;

      const lottieAnim = lottie.loadAnimation({
        container: lottieContainer,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: lottieSrc
      });

      ScrollTrigger.create({
        trigger: lottieContainer,
        start: "top center+=100",
        once: true,
        onEnter: () => {
          lottieAnim.play();
        }
      });
    });
  })();
});
