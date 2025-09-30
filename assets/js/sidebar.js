document.addEventListener("DOMContentLoaded", function () {
  const sidebarToggle = document.querySelector(".js-sidebar-toggle");
  if (!sidebarToggle) return;
  const sidebarContainer = document.querySelector(".js-sidebar-container");
  const sidebar = document.querySelector(".js-sidebar");

  sidebarToggle.addEventListener("click", function () {
    const headerHeight = document.querySelector(".js-header").offsetHeight;
    const sidebarHeaderHeight = sidebar.querySelector(
      ".js-sidebar-header"
    ).offsetHeight;
    sidebarContainer.style.height =
      window.innerHeight - headerHeight - sidebarHeaderHeight + "px";
    sidebar.classList.toggle("open");
    document.body.classList.toggle("overflow-hidden");
  });

  // Close sidebar when clicking inside sidebarContainer
  sidebarContainer.addEventListener("click", function () {
    sidebar.classList.remove("open");
    document.body.classList.remove("overflow-hidden");
  });
});
