document.addEventListener("DOMContentLoaded", () => {
    // Subscribe modal functionality
    const modal = document.getElementById('subscribeModal');
    const form = document.getElementById('subscribeForm');
    
    // Open modal function
    window.openSubscribeModal = function() {
        if (modal) {
            modal.style.display = 'flex';
            document.body.classList.add('modal-open');
            // Focus on first input
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    };
    
    // Close modal function
    window.closeSubscribeModal = function() {
        if (modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
            // Reset form
            if (form) {
                form.reset();
            }
        }
    };
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeSubscribeModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
            closeSubscribeModal();
        }
    });
    
    // Handle form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.subscribe-submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            // Show loading state
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(form);
            const data = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                marketing: formData.get('marketing') === 'on'
            };
            
            // Simulate API call (replace with actual endpoint)
            setTimeout(() => {
                // Success - you can replace this with actual API call
                console.log('Subscription data:', data);
                
                // Show success message
                showSuccessMessage();
                
                // Reset form and close modal after delay
                setTimeout(() => {
                    closeSubscribeModal();
                    // Reset button state
                    btnText.style.display = 'inline';
                    btnLoading.style.display = 'none';
                    submitBtn.disabled = false;
                }, 2000);
                
            }, 1500);
        });
    }
    
    // Show success message
    function showSuccessMessage() {
        const modalContent = modal.querySelector('.subscribe-modal-content');
        const originalContent = modalContent.innerHTML;
        
        modalContent.innerHTML = `
            <div class="subscribe-success">
                <div class="success-icon">✅</div>
                <h3>Thank You!</h3>
                <p>You've been successfully subscribed to our newsletter.</p>
                <p>We'll keep you updated with the latest insights and updates from LanceDB.</p>
            </div>
        `;
    }
});

