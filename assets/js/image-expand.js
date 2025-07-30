document.addEventListener('DOMContentLoaded', function() {
  // Create modal elements
  const modal = document.createElement('div');
  modal.id = 'image-modal';
  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <img class="modal-image" src="" alt="">
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Get all images in the content area
  const images = document.querySelectorAll('.docs-article-content img, .docs-content img');
  
  images.forEach(img => {
    // Only add click handler to images that don't have a parent link
    if (!img.closest('a')) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', function() {
        const modalImg = modal.querySelector('.modal-image');
        modalImg.src = this.src;
        modalImg.alt = this.alt;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    }
  });

  // Close modal functionality
  const closeModal = () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  };

  // Close on overlay click
  modal.querySelector('.modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
      closeModal();
    }
  });

  // Close on close button click
  modal.querySelector('.modal-close').addEventListener('click', closeModal);

  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });
}); 