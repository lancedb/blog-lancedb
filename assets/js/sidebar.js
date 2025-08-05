document.addEventListener("DOMContentLoaded", function () {
  const sidebarToggle = document.querySelector(".docs-sidebar__toggle");
  if (!sidebarToggle) return;
  const sidebarContainer = document.querySelector(".docs-sidebar");
  const sidebar = document.querySelector(".docs-sidebar__wrap");

  sidebarToggle.addEventListener("click", function () {
    const headerHeight = document.querySelector(".js-header").offsetHeight;
    const sidebarHeaderHeight = sidebar.querySelector(
      ".docs-sidebar__header"
    ).offsetHeight;
    sidebarContainer.style.height =
      window.innerHeight - headerHeight - sidebarHeaderHeight + "px";
    sidebar.classList.toggle("open");
    document.body.classList.toggle("overflow-hidden");
  });
});
