class SearchEngine {
  constructor() {
    this.searchIndex = null;
    this.documents = [];
    this.isInitialized = false;
    this.searchInput = null;
    this.searchResults = null;
    this.searchOverlay = null;
  }

  async init() {
    if (this.isInitialized) return;

    try {
      // Load search index
      const response = await fetch('/index.json');
      this.documents = await response.json();
      
      // Build Lunr index
      this.searchIndex = lunr(function() {
        this.ref('id');
        this.field('title', { boost: 10 });
        this.field('summary', { boost: 5 });
        this.field('content');
        this.field('tags', { boost: 3 });
        this.field('section', { boost: 2 });

        // Add documents to index
        for (const doc of window.searchEngine.documents) {
          this.add(doc);
        }
      });

      this.isInitialized = true;
      console.log(`Search index built with ${this.documents.length} documents`);
    } catch (error) {
      console.error('Failed to initialize search:', error);
    }
  }

  search(query, contextFilter = null) {
    if (!this.isInitialized || !query.trim()) {
      return [];
    }

    try {
      const results = this.searchIndex.search(query);
      let filteredResults = results.map(result => {
        const doc = this.documents.find(d => d.id === result.ref);
        return {
          ...doc,
          score: result.score,
          matchData: result.matchData
        };
      });

      // Filter results based on URL path
      if (contextFilter) {
        filteredResults = filteredResults.filter(doc => {
          if (contextFilter === 'blog') {
            return doc.url && doc.url.startsWith('/blog');
          } else if (contextFilter === 'docs') {
            return doc.url && doc.url.startsWith('/docs');
          }
          return true;
        });
      }

      return filteredResults.slice(0, 10); // Limit to 10 results
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  getCurrentContext() {
    const path = window.location.pathname;
    if (path.startsWith('/blog')) {
      return 'blog';
    } else if (path.startsWith('/docs')) {
      return 'docs';
    }
    return null;
  }

  highlightMatches(text, query) {
    if (!query.trim()) return text;
    
    const words = query.toLowerCase().split(/\s+/);
    let highlightedText = text;
    
    words.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });
    
    return highlightedText;
  }

  renderResults(results, query, context = null) {
    if (!this.searchResults) return;

    if (results.length === 0) {
      const contextLabel = context === 'blog' ? ' in blog posts' : context === 'docs' ? ' in documentation' : '';
      this.searchResults.innerHTML = query.trim() 
        ? `<div class="search-no-results">No results found${contextLabel}</div>`
        : '';
      return;
    }

    // Add context indicator at the top of results
    let contextIndicator = '';
    if (context) {
      const contextLabel = context === 'blog' ? 'Blog Posts' : 'Documentation';
      const totalCount = results.length;
      contextIndicator = `
        <div class="search-context-indicator">
          Searching in ${contextLabel} (${totalCount} result${totalCount !== 1 ? 's' : ''})
        </div>
      `;
    }

    const resultsHtml = results.map(result => {
      const highlightedTitle = this.highlightMatches(result.title, query);
      const highlightedSummary = this.highlightMatches(result.summary, query);
      
      // Determine type based on URL path
      const typeLabel = result.url && result.url.startsWith('/docs') ? 'Documentation' : 'Blog';
      
      return `
        <div class="search-result">
          <div class="search-result-header">
            <a href="${result.url}" class="search-result-title">${highlightedTitle}</a>
            <span class="search-result-type">${typeLabel}</span>
          </div>
          <div class="search-result-summary">${highlightedSummary}</div>
          <div class="search-result-meta">
            <span class="search-result-date">${result.date}</span>
            ${result.tags && result.tags.length > 0 ? 
              `<span class="search-result-tags">${result.tags.slice(0, 3).join(', ')}</span>` : 
              ''
            }
          </div>
        </div>
      `;
    }).join('');

    this.searchResults.innerHTML = contextIndicator + resultsHtml;
  }

  setupEventListeners() {
    // Search input handling
    if (this.searchInput) {
      let searchTimeout;
      
      this.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value;
        
        if (query.length === 0) {
          this.hideSearchResults();
          return;
        }
        
        if (query.length < 2) return;
        
        searchTimeout = setTimeout(() => {
          const context = this.getCurrentContext();
          const results = this.search(query, context);
          this.renderResults(results, query, context);
          this.showSearchResults();
        }, 150);
      });

      this.searchInput.addEventListener('focus', () => {
        if (this.searchInput.value.length >= 2) {
          this.showSearchResults();
        }
      });

      // Close search on escape
      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.hideSearchResults();
          this.searchInput.blur();
        }
      });
    }

    // Click outside to close
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        this.hideSearchResults();
      }
    });
  }

  showSearchResults() {
    if (this.searchOverlay) {
      this.searchOverlay.classList.add('search-overlay--active');
    }
    if (this.searchResults) {
      this.searchResults.classList.add('search-results--active');
    }
  }

  hideSearchResults() {
    if (this.searchOverlay) {
      this.searchOverlay.classList.remove('search-overlay--active');
    }
    if (this.searchResults) {
      this.searchResults.classList.remove('search-results--active');
    }
  }

  bindElements() {
    this.searchInput = document.querySelector('#search-input');
    this.searchResults = document.querySelector('#search-results');
    this.searchOverlay = document.querySelector('#search-overlay');
    
    if (this.searchInput && this.searchResults) {
      this.setupEventListeners();
    }
  }
}

// Initialize search engine
window.searchEngine = new SearchEngine();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.searchEngine.bindElements();
  window.searchEngine.init();
});