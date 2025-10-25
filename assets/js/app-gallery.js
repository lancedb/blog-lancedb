// Define filter buttons at the top
document.addEventListener("DOMContentLoaded", function () {
  const appGalleryWrapper = document.querySelector(".js-app-gallery");
  const appGalleryItems = appGalleryWrapper.querySelectorAll(".app-gallery__item");

  const mixer = mixitup(appGalleryWrapper, {
    load: {
      filter: '*'
    },
    controls: {
      toggleLogic: 'and'
    },
    multifilter: {
      enable: true,
    },
  });

  appGalleryItems.forEach((item) => {
    const externalLink = item.querySelector(".js-live-app");
    if (externalLink) {
      externalLink.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const url = externalLink.getAttribute("data-url");
        window.open(url, "_blank");
      });
    }

    const learnMoreButton = item.querySelector(".js-learn-more");
    if (learnMoreButton) {
      learnMoreButton.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const url = learnMoreButton.getAttribute("data-url");
        if (url && url !== "#") {
          window.location.href = url;
        }
      });
    }
  });
});
