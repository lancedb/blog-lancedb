document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector("header");
  const headerHeight = header ? header.offsetHeight : 0;

  const headings = document.querySelectorAll(
    ".post-content h2, .post-content h3, .docs-article-content h2, .docs-article-content h3"
  );

  headings.forEach((heading) => {
    // Ensure heading has an ID
    if (!heading.id) {
      heading.id = heading.textContent
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    // Create link element
    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.className = "heading-link";
    link.textContent = "#";
    link.title = "Copy link to section";

    // Add click handler
    link.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
        // Copy the URL with the hash to clipboard
        const url = `${window.location.origin}${window.location.pathname}#${heading.id}`;
        await navigator.clipboard.writeText(url);

        // Show copied state
        link.classList.add("copied");
        link.textContent = "✓";

        // Reset after 2 seconds
        setTimeout(() => {
          link.classList.remove("copied");
          link.textContent = "#";
        }, 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = `${window.location.origin}${window.location.pathname}#${heading.id}`;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand("copy");
          link.classList.add("copied");
          link.textContent = "✓";
          setTimeout(() => {
            link.classList.remove("copied");
            link.textContent = "#";
          }, 2000);
        } catch (err) {
          console.error("Fallback failed:", err);
        }
        document.body.removeChild(textArea);
      }
    });

    // Insert link before the heading
    heading.appendChild(link);
  });

  if (window.location.hash) {
    const id = window.location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => {
        const elTop = el.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elTop - headerHeight,
          behavior: "smooth",
        });
      }, 0);
    }
  }
});
