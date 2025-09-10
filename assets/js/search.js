class SimpleSearchEngine {
  constructor() {
    this.documents = [];
    this.isInitialized = false;
    this.searchInput = null;
    this.searchResults = null;
    this.searchOverlay = null;
    this.searchInputMobile = null;
    this.searchResultsMobile = null;
    this.searchOverlayMobile = null;
    this.selectedIndex = -1;
    this.currentResults = [];
  }

  async init() {
    if (this.isInitialized) return;

    console.log('Initializing search...');

    try {
      const response = await fetch('/index.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      this.documents = await response.json();
      console.log(`Loaded ${this.documents.length} documents`);

      this.isInitialized = true;
      console.log('Search initialized successfully');

    } catch (error) {
      console.error('Failed to initialize search:', error);
    }
  }

  search(query, contextFilter = null) {
    if (!this.isInitialized || !query.trim()) {
      return [];
    }

    console.log('Searching for:', query, 'with context:', contextFilter);

    const searchTerm = query.toLowerCase();
    const words = searchTerm.split(/\s+/).filter(word => word.length > 1);

    const results = this.documents
      .map(doc => {
        let score = 0;
        const title = (doc.title || '').toLowerCase();
        const summary = (doc.summary || '').toLowerCase();
        const content = (doc.content || '').toLowerCase();
        const tags = Array.isArray(doc.tags) ? doc.tags.join(' ').toLowerCase() : '';
        const section = (doc.section || '').toLowerCase();

        // Debug logging for first few documents
        const shouldDebug = this.documents.indexOf(doc) < 3;
        if (shouldDebug) {
          console.log('Debug doc:', {
            originalTitle: doc.title,
            lowerTitle: title,
            searchWords: words,
            url: doc.url
          });
        }

        // Score based on matches
        words.forEach(word => {
          // Title matches (highest weight)
          if (title.includes(word)) {
            const titleScore = title === word ? 50 : 20; // exact match vs partial
            score += titleScore;
            if (shouldDebug) {
              console.log(`Title match found: "${word}" in "${title}", score: ${titleScore}`);
            }
          }

          // Summary matches
          if (summary.includes(word)) {
            score += 10;
          }

          // Content matches
          if (content.includes(word)) {
            score += 2;
          }

          // Tag matches
          if (tags.includes(word)) {
            score += 15;
          }

          // Section matches
          if (section.includes(word)) {
            score += 5;
          }
        });

        if (shouldDebug && score > 0) {
          console.log(`Final score for "${doc.title}": ${score}`);
        }

        return { ...doc, score };
      })
      .filter(doc => doc.score > 0)
      .sort((a, b) => b.score - a.score);

    // Apply context filter
    let filteredResults = results;
    if (contextFilter) {
      filteredResults = results.filter(doc => {
        if (contextFilter === 'blog') {
          return doc.url && doc.url.startsWith('/blog');
        } else if (contextFilter === 'docs') {
          return doc.url && doc.url.startsWith('/docs');
        }
        return true;
      });
    }

    console.log('Search results:', filteredResults.length);
    this.currentResults = filteredResults.slice(0, 10);
    this.selectedIndex = -1; // Reset selection
    return this.currentResults;
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
    if (!query.trim() || !text) return text;

    const words = query.toLowerCase().split(/\s+/).filter(word => word.length > 1);
    let highlightedText = text;

    words.forEach(word => {
      const regex = new RegExp(`(${this.escapeRegExp(word)})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });

    return highlightedText;
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  navigateResults(direction) {
    if (this.currentResults.length === 0) return;

    const previousIndex = this.selectedIndex;

    if (direction === 'down') {
      this.selectedIndex = Math.min(this.selectedIndex + 1, this.currentResults.length - 1);
    } else if (direction === 'up') {
      this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
    } else if (direction === 'first') {
      this.selectedIndex = 0;
    } else if (direction === 'last') {
      this.selectedIndex = this.currentResults.length - 1;
    }

    // Only update if index changed
    if (previousIndex !== this.selectedIndex) {
      this.updateSelectedResult();
    }
  }

  updateSelectedResult() {
    const resultElements = document.querySelectorAll('.search-result');

    // Remove previous selection
    resultElements.forEach((element, index) => {
      element.classList.remove('search-result--selected');
      if (index === this.selectedIndex) {
        element.classList.add('search-result--selected');
        element.setAttribute('aria-selected', 'true');

        // Smooth scroll to selected element
        element.scrollIntoView({ 
          block: 'nearest', 
          behavior: 'smooth',
          inline: 'nearest'
        });
      } else {
        element.setAttribute('aria-selected', 'false');
      }
    });

    // Update ARIA live region for screen readers
    this.announceSelection();
  }

  announceSelection() {
    if (this.selectedIndex >= 0 && this.selectedIndex < this.currentResults.length) {
      const selectedResult = this.currentResults[this.selectedIndex];
      const announcement = `Selected result ${this.selectedIndex + 1} of ${this.currentResults.length}: ${selectedResult.title}`;

      // Create or update aria-live region
      let liveRegion = document.getElementById('search-live-region');
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'search-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        document.body.appendChild(liveRegion);
      }
      liveRegion.textContent = announcement;
    }
  }

  selectCurrentResult() {
    if (this.selectedIndex >= 0 && this.selectedIndex < this.currentResults.length) {
      const selectedResult = this.currentResults[this.selectedIndex];
      if (selectedResult && selectedResult.url) {
        window.location.href = selectedResult.url;
      }
    }
  }

  renderResults(results, query, context = null) {
    if (!this.searchResults) return;

    console.log('Rendering results:', results.length);

    if (results.length === 0) {
      const contextLabel = context === 'blog' ? ' in blog posts' : context === 'docs' ? ' in documentation' : '';
      this.searchResults.innerHTML = query.trim() ? 
        `<div class="search-no-results">No results found${contextLabel}</div>` : '';
      return;
    }

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

    const resultsHtml = results.map((result, index) => {
      const highlightedTitle = this.highlightMatches(result.title || 'Untitled', query);
      const highlightedSummary = this.highlightMatches(result.summary || '', query);
      const typeLabel = result.url && result.url.startsWith('/docs') ? 'Documentation' : 'Blog';
      const selectedClass = index === this.selectedIndex ? ' search-result--selected' : '';

      return `
        <div class="search-result${selectedClass}" data-index="${index}" data-url="${result.url}">
          <div class="search-result-header">
            <a href="${result.url}" class="search-result-title">${highlightedTitle}</a>
            <span class="search-result-type">${typeLabel}</span>
          </div>
          <div class="search-result-summary">${highlightedSummary}</div>
          <div class="search-result-meta">
            <span class="search-result-date">${result.date || ''}</span>
            ${result.tags && result.tags.length > 0 ? 
              `<span class="search-result-tags">${result.tags.slice(0, 3).join(', ')}</span>` : ''}
          </div>
        </div>
      `;
    }).join('');

    this.searchResults.innerHTML = contextIndicator + resultsHtml;

    // Add click listeners to search results
    this.addResultClickListeners();
  }

  renderResultsMobile(results, query, context = null) {
    if (!this.searchResultsMobile) return;

    if (results.length === 0) {
      const contextLabel = context === 'blog' ? ' in blog posts' : context === 'docs' ? ' in documentation' : '';
      this.searchResultsMobile.innerHTML = query.trim() ? 
        `<div class="search-no-results">No results found${contextLabel}</div>` : '';
      return;
    }

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

    const resultsHtml = results.map((result, index) => {
      const highlightedTitle = this.highlightMatches(result.title || 'Untitled', query);
      const highlightedSummary = this.highlightMatches(result.summary || '', query);
      const typeLabel = result.url && result.url.startsWith('/docs') ? 'Documentation' : 'Blog';
      const selectedClass = index === this.selectedIndex ? ' search-result--selected' : '';

      return `
        <div class="search-result${selectedClass}" data-index="${index}" data-url="${result.url}">
          <div class="search-result-header">
            <a href="${result.url}" class="search-result-title">${highlightedTitle}</a>
            <span class="search-result-type">${typeLabel}</span>
          </div>
          <div class="search-result-summary">${highlightedSummary}</div>
          <div class="search-result-meta">
            <span class="search-result-date">${result.date || ''}</span>
            ${result.tags && result.tags.length > 0 ? 
              `<span class="search-result-tags">${result.tags.slice(0, 3).join(', ')}</span>` : ''}
          </div>
        </div>
      `;
    }).join('');

    this.searchResultsMobile.innerHTML = contextIndicator + resultsHtml;

    // Add click listeners to mobile search results
    this.addResultClickListeners();
  }

  addResultClickListeners() {
    const resultElements = document.querySelectorAll('.search-result');
    resultElements.forEach((element, index) => {
      element.addEventListener('click', (e) => {
        // If clicking on the link, let it handle navigation
        if (e.target.tagName === 'A') return;

        // Otherwise, navigate to the result URL
        const url = element.dataset.url;
        if (url) {
          window.location.href = url;
        }
      });

      element.addEventListener('mouseenter', () => {
        this.selectedIndex = index;
        this.updateSelectedResult();
      });
    });
  }

  setupEventListeners() {
    if (this.searchInput) {
      let searchTimeout;

      console.log('Setting up desktop search listeners');

      this.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value;

        console.log('Search input:', query);

        if (query.length === 0) {
          this.hideSearchResults();
          return;
        }

        if (query.length < 2) return;

        searchTimeout = setTimeout(() => {
          const context = this.getCurrentContext();
          console.log('Current context:', context);
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

      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.hideSearchResults();
          this.searchInput.blur();
          this.selectedIndex = -1;
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (this.currentResults.length > 0) {
            this.navigateResults('down');
            if (!this.isSearchResultsVisible()) {
              this.showSearchResults();
            }
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (this.currentResults.length > 0) {
            this.navigateResults('up');
            if (!this.isSearchResultsVisible()) {
              this.showSearchResults();
            }
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.selectCurrentResult();
        } else if (e.key === 'Home' && e.ctrlKey) {
          e.preventDefault();
          this.navigateResults('first');
        } else if (e.key === 'End' && e.ctrlKey) {
          e.preventDefault();
          this.navigateResults('last');
        } else if (e.key === 'Tab') {
          // Allow default tab behavior but close search if needed
          if (this.isSearchResultsVisible()) {
            this.hideSearchResults();
          }
        }
      });
    }
  }

  setupMobileEventListeners() {
    if (this.searchInputMobile) {
      let searchTimeout;

      console.log('Setting up mobile search listeners');

      this.searchInputMobile.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value;

        if (query.length === 0) {
          this.hideSearchResultsMobile();
          return;
        }

        if (query.length < 2) return;

        searchTimeout = setTimeout(() => {
          const context = this.getCurrentContext();
          const results = this.search(query, context);
          this.renderResultsMobile(results, query, context);
          this.showSearchResultsMobile();
        }, 150);
      });

      this.searchInputMobile.addEventListener('focus', () => {
        if (this.searchInputMobile.value.length >= 2) {
          this.showSearchResultsMobile();
        }
      });

      this.searchInputMobile.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.hideSearchResultsMobile();
          this.searchInputMobile.blur();
          this.selectedIndex = -1;
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (this.currentResults.length > 0) {
            this.navigateResults('down');
            if (!this.isSearchResultsMobileVisible()) {
              this.showSearchResultsMobile();
            }
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (this.currentResults.length > 0) {
            this.navigateResults('up');
            if (!this.isSearchResultsMobileVisible()) {
              this.showSearchResultsMobile();
            }
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          this.selectCurrentResult();
        } else if (e.key === 'Home' && e.ctrlKey) {
          e.preventDefault();
          this.navigateResults('first');
        } else if (e.key === 'End' && e.ctrlKey) {
          e.preventDefault();
          this.navigateResults('last');
        }
      });
    }
  }

  isSearchResultsVisible() {
    return this.searchResults && this.searchResults.classList.contains('search-results--active');
  }

  isSearchResultsMobileVisible() {
    return this.searchResultsMobile && this.searchResultsMobile.classList.contains('search-results--active');
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

  showSearchResultsMobile() {
    if (this.searchOverlayMobile) {
      this.searchOverlayMobile.classList.add('search-overlay--active');
    }
    if (this.searchResultsMobile) {
      this.searchResultsMobile.classList.add('search-results--active');
    }
  }

  hideSearchResultsMobile() {
    if (this.searchOverlayMobile) {
      this.searchOverlayMobile.classList.remove('search-overlay--active');
    }
    if (this.searchResultsMobile) {
      this.searchResultsMobile.classList.remove('search-results--active');
    }
  }

  shouldShowSearch() {
    const path = window.location.pathname;
    return path.startsWith('/blog') || path.startsWith('/docs');
  }

  hideSearchContainers() {
    const searchContainers = document.querySelectorAll('.search-container');
    searchContainers.forEach(container => {
      container.style.display = 'none';
    });
  }

  showSearchContainers() {
    const searchContainers = document.querySelectorAll('.search-container');
    searchContainers.forEach(container => {
      container.style.display = 'block';
    });
  }

  bindElements() {
    console.log('Binding search elements...');

    // Check if search should be visible on this page
    if (!this.shouldShowSearch()) {
      console.log('Search not needed on this page, keeping search containers hidden');
      return;
    }

    // Show search containers on /blog and /docs pages
    console.log('Search needed on this page, showing search containers');
    this.showSearchContainers();

    // Desktop search elements
    this.searchInput = document.querySelector('#search-input');
    this.searchResults = document.querySelector('#search-results');
    this.searchOverlay = document.querySelector('#search-overlay');

    // Mobile search elements  
    this.searchInputMobile = document.querySelector('#search-input-mobile');
    this.searchResultsMobile = document.querySelector('#search-results-mobile');
    this.searchOverlayMobile = document.querySelector('#search-overlay-mobile');

    console.log('Desktop elements found:', {
      input: !!this.searchInput,
      results: !!this.searchResults,
      overlay: !!this.searchOverlay
    });

    console.log('Mobile elements found:', {
      input: !!this.searchInputMobile,
      results: !!this.searchResultsMobile,
      overlay: !!this.searchOverlayMobile
    });

    // Setup listeners for desktop
    if (this.searchInput && this.searchResults) {
      this.setupEventListeners();
    }

    // Setup listeners for mobile
    if (this.searchInputMobile && this.searchResultsMobile) {
      this.setupMobileEventListeners();
    }

    // Global click handler
    document.addEventListener('click', (e) => {
      const isInsideSearchContainer = e.target.closest('.search-container');
      const isSearchInput = e.target.matches('.search-input');
      const isSearchResult = e.target.closest('.search-result');
      const isSearchOverlay = e.target.matches('.search-overlay');

      // Close search if clicking outside the container OR on the overlay
      if (!isInsideSearchContainer || isSearchOverlay) {
        this.hideSearchResults();
        this.hideSearchResultsMobile();
      }
    });

    // Global keyboard shortcut to focus search
    this.setupGlobalKeyboardShortcuts();
  }

  setupGlobalKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+K or Cmd+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.focusSearchInput();
      }
      // Forward slash to focus search (like GitHub)
      else if (e.key === '/' && !this.isInputFocused()) {
        e.preventDefault();
        this.focusSearchInput();
      }
    });
  }

  isInputFocused() {
    const activeElement = document.activeElement;
    return activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.contentEditable === 'true'
    );
  }

  focusSearchInput() {
    // Try desktop search input first
    if (this.searchInput && this.isElementVisible(this.searchInput)) {
      this.searchInput.focus();
      this.searchInput.select(); // Select any existing text
    }
    // Fallback to mobile search input
    else if (this.searchInputMobile && this.isElementVisible(this.searchInputMobile)) {
      this.searchInputMobile.focus();
      this.searchInputMobile.select();
    }
  }

  isElementVisible(element) {
    return element && window.getComputedStyle(element).display !== 'none' &&
           window.getComputedStyle(element).visibility !== 'hidden' &&
           element.offsetParent !== null;
  }
}

// Initialize search engine
console.log('Creating search engine...');
window.searchEngine = new SimpleSearchEngine();

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing search...');
  window.searchEngine.bindElements();
  window.searchEngine.init();
});