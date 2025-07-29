// Enhanced Code Block Functionality
console.log('code-blocks.js loaded');
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded fired');
    // Add language attributes and copy buttons to code blocks
    function enhanceCodeBlocks() {
        // Target code blocks in both regular and highlighted contexts
        const codeBlocks = document.querySelectorAll('pre code, .highlight pre code');
        console.log('Found code blocks:', codeBlocks.length);
        codeBlocks.forEach(function(codeBlock, idx) {
            console.log('Code block', idx, codeBlock);
            const pre = codeBlock.parentElement;
            if (pre.querySelector('.copy-button')) return;
            // Create copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            copyButton.setAttribute('aria-label', 'Copy code to clipboard');
            copyButton.setAttribute('title', 'Copy code');
            // Add copy functionality
            copyButton.addEventListener('click', function() {
                const code = codeBlock.textContent;
                navigator.clipboard.writeText(code).then(function() {
                    copyButton.classList.add('copied');
                    setTimeout(function() {
                        copyButton.classList.remove('copied');
                    }, 2000);
                }).catch(function() {
                    const textArea = document.createElement('textarea');
                    textArea.value = code;
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    try {
                        document.execCommand('copy');
                        copyButton.classList.add('copied');
                        setTimeout(function() {
                            copyButton.classList.remove('copied');
                        }, 2000);
                    } catch (err) {}
                    document.body.removeChild(textArea);
                });
            });
            pre.appendChild(copyButton);
        });
    }
    enhanceCodeBlocks();
    addLineNumbers();
    highlightLines();
    monitorPerformance();
});

// Add line numbers to code blocks with line-numbers class
function addLineNumbers() {
    const lineNumberBlocks = document.querySelectorAll('pre.line-numbers code');
    
    lineNumberBlocks.forEach(function(codeBlock) {
        const lines = codeBlock.textContent.split('\n');
        const lineCount = lines.length;
        
        // Add CSS counter reset
        codeBlock.style.counterReset = 'line-number';
        
        // Split content into lines and wrap each in a span
        const wrappedContent = lines.map(function(line, index) {
            if (index === lineCount - 1 && line === '') {
                return ''; // Skip empty last line
            }
            return '<span class="code-line">' + line + '</span>';
        }).join('\n');
        
        codeBlock.innerHTML = wrappedContent;
    });
}

// Highlight specific lines in code blocks
function highlightLines() {
    const codeBlocks = document.querySelectorAll('pre[data-highlight] code');
    
    codeBlocks.forEach(function(codeBlock) {
        const pre = codeBlock.parentElement;
        const highlightData = pre.getAttribute('data-highlight');
        
        if (highlightData) {
            const lines = codeBlock.textContent.split('\n');
            const highlightRanges = parseHighlightData(highlightData);
            
            const wrappedContent = lines.map(function(line, index) {
                const lineNumber = index + 1;
                const isHighlighted = highlightRanges.some(function(range) {
                    return lineNumber >= range.start && lineNumber <= range.end;
                });
                
                if (isHighlighted) {
                    return '<span class="highlight-line">' + line + '</span>';
                }
                return line;
            }).join('\n');
            
            codeBlock.innerHTML = wrappedContent;
        }
    });
}

// Parse highlight data (e.g., "1-3,5,7-9")
function parseHighlightData(data) {
    const ranges = [];
    const parts = data.split(',');
    
    parts.forEach(function(part) {
        part = part.trim();
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(Number);
            ranges.push({ start: start, end: end });
        } else {
            const line = Number(part);
            ranges.push({ start: line, end: line });
        }
    });
    
    return ranges;
}

// Add smooth scrolling to code blocks that are too wide
function addSmoothScrolling() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(function(codeBlock) {
        codeBlock.style.scrollBehavior = 'smooth';
    });
}

// Add keyboard navigation for code blocks
function addKeyboardNavigation() {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(function(pre) {
        pre.setAttribute('tabindex', '0');
        
        pre.addEventListener('keydown', function(e) {
            const code = pre.querySelector('code');
            
            if (e.key === 'ArrowLeft') {
                code.scrollLeft -= 20;
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                code.scrollLeft += 20;
                e.preventDefault();
            } else if (e.key === 'Home') {
                code.scrollLeft = 0;
                e.preventDefault();
            } else if (e.key === 'End') {
                code.scrollLeft = code.scrollWidth;
                e.preventDefault();
            }
        });
    });
}

// Initialize all enhancements
// enhanceCodeBlocks(); // This is now handled by DOMContentLoaded
addLineNumbers();
highlightLines();
addSmoothScrolling();
addKeyboardNavigation();

// Add intersection observer for code block animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const codeBlockObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = '0.1s';
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe all code blocks
document.querySelectorAll('pre').forEach(function(pre) {
    codeBlockObserver.observe(pre);
});

// Add touch support for mobile devices
function addTouchSupport() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(function(codeBlock) {
        let isScrolling = false;
        
        codeBlock.addEventListener('touchstart', function() {
            isScrolling = true;
        });
        
        codeBlock.addEventListener('touchend', function() {
            setTimeout(function() {
                isScrolling = false;
            }, 100);
        });
        
        // Prevent text selection while scrolling
        codeBlock.addEventListener('selectstart', function(e) {
            if (isScrolling) {
                e.preventDefault();
            }
        });
    });
}

addTouchSupport();

// Add performance monitoring
function monitorPerformance() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    if (codeBlocks.length > 10) {
        console.log(`Enhanced ${codeBlocks.length} code blocks`);
    }
    
    // Monitor copy button usage
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('copy-button')) {
            // Analytics could be added here
            console.log('Code copied from:', e.target.parentElement.getAttribute('data-lang'));
        }
    });
}

monitorPerformance();

// Add CSS animation class
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: codeBlockSlideIn 0.4s ease-out forwards;
    }
    
    @media (prefers-reduced-motion: reduce) {
        .post-content pre {
            animation: none;
        }
        
        .animate-in {
            animation: none;
        }
    }
`;
document.head.appendChild(style); 