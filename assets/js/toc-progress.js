document.addEventListener('DOMContentLoaded', function() {
    const toc = document.querySelector('.toc');
    if (!toc) return;

    const tocLinks = toc.querySelectorAll('a');
    const headings = Array.from(tocLinks).map(link => {
        const id = link.getAttribute('href').substring(1);
        return document.getElementById(id);
    }).filter(Boolean);

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };

    const updateSectionColors = (currentIndex) => {
        tocLinks.forEach((link, index) => {
            if (index <= currentIndex) {
                // Past and current sections
                link.classList.add('read');
                link.classList.remove('unread');
            } else {
                // Future sections
                link.classList.add('unread');
                link.classList.remove('read');
            }
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const tocLink = toc.querySelector(`a[href="#${id}"]`);
            const currentIndex = headings.indexOf(entry.target);
            updateSectionColors(currentIndex);
        });
    }, observerOptions);

    // Add click handlers to all TOC links
    tocLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            // Update colors immediately
            updateSectionColors(index);
            
            // Smooth scroll to the section
            targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Observe all headings
    headings.forEach(heading => observer.observe(heading));
}); 