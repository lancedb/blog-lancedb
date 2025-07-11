document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-link');
    const posts = document.querySelectorAll('article[data-categories]');
    const featuredSection = document.querySelector('.featured-section');
    const postGrid = document.querySelector('.post-grid');
    const pagination = document.querySelector('.pagination');
    
    // Track original pagination for restoration
    const originalPaginationDisplay = pagination ? pagination.style.display : '';
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedCategory = this.getAttribute('data-category');
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.add('inactive');
            });
            this.classList.remove('inactive');
            this.classList.add('active');
            
            // Filter posts
            filterPosts(selectedCategory);
            
            // Update pagination visibility
            updatePagination(selectedCategory);
        });
    });
    
    function filterPosts(category) {
        let visibleCount = 0;
        
        posts.forEach(post => {
            const postCategories = post.getAttribute('data-categories');
            const shouldShow = category === 'all' || 
                              postCategories.toLowerCase().includes(category.toLowerCase());
            
            if (shouldShow) {
                post.style.display = '';
                post.style.opacity = '0';
                post.style.transform = 'translateY(20px)';
                
                // Animate in with delay based on visible count
                setTimeout(() => {
                    post.style.transition = 'all 0.3s ease';
                    post.style.opacity = '1';
                    post.style.transform = 'translateY(0)';
                }, visibleCount * 50);
                
                visibleCount++;
            } else {
                post.style.transition = 'all 0.2s ease';
                post.style.opacity = '0';
                post.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    post.style.display = 'none';
                }, 200);
            }
        });
        
        // Show empty state if no posts
        showEmptyState(visibleCount === 0 && category !== 'all');
    }
    
    function updatePagination(category) {
        if (pagination) {
            if (category === 'all') {
                pagination.style.display = originalPaginationDisplay;
            } else {
                pagination.style.display = 'none';
            }
        }
    }
    
    function showEmptyState(show) {
        let emptyState = document.querySelector('.empty-state-filter');
        
        if (show && !emptyState) {
            emptyState = document.createElement('div');
            emptyState.className = 'empty-state empty-state-filter';
            emptyState.innerHTML = `
                <h3>No posts found in this category</h3>
                <p>Try selecting a different category or view all posts.</p>
            `;
            postGrid.appendChild(emptyState);
            
            // Animate in
            setTimeout(() => {
                emptyState.style.opacity = '1';
                emptyState.style.transform = 'translateY(0)';
            }, 100);
        } else if (!show && emptyState) {
            emptyState.style.opacity = '0';
            emptyState.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                emptyState.remove();
            }, 300);
        }
    }
    
    // Add smooth transitions to filter buttons
    filterButtons.forEach(button => {
        button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    // Initialize empty state styling
    const style = document.createElement('style');
    style.textContent = `
        .empty-state-filter {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            grid-column: 1 / -1;
            text-align: center;
            padding: 4rem 2rem;
            color: var(--text-secondary);
        }
        
        .empty-state-filter h3 {
            font-family: 'Roboto Slab', serif;
            font-size: 1.5rem;
            color: var(--text-primary);
            margin-bottom: 1rem;
        }
        
        .empty-state-filter p {
            margin-bottom: 0;
        }
    `;
    document.head.appendChild(style);
}); 