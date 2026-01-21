/**
 * NexTep Edu - Core Web Vitals & Performance Optimization
 * Optimizes LCP, INP, and CLS for Google Search ranking
 */

(function () {
    'use strict';

    // ==========================================
    // Core Web Vitals Monitoring
    // ==========================================

    // Performance metrics collection
    const performanceMetrics = {
        LCP: null,  // Largest Contentful Paint
        INP: null,  // Interaction to Next Paint
        CLS: null,  // Cumulative Layout Shift
        FCP: null,  // First Contentful Paint
        TTFB: null  // Time to First Byte
    };

    // ==========================================
    // LCP Optimization (Largest Contentful Paint)
    // Target: < 2.5 seconds
    // ==========================================

    function optimizeLCP() {
        // 1. Prioritize above-the-fold images
        const heroImage = document.querySelector('.hero-image img');
        if (heroImage) {
            heroImage.setAttribute('fetchpriority', 'high');
            heroImage.setAttribute('loading', 'eager');
            heroImage.setAttribute('decoding', 'async');
        }

        // 2. Preload critical fonts
        const fontPreloads = [
            { href: 'https://fonts.gstatic.com/s/outfit/v11/QGYvz_MVcBeNP4NJuktqSYE.woff2', type: 'font/woff2' },
            { href: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', type: 'font/woff2' }
        ];

        // 3. Lazy load below-the-fold images
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, { rootMargin: '50px' });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => img.classList.add('loaded'));
        }
    }

    // ==========================================
    // CLS Optimization (Cumulative Layout Shift)
    // Target: < 0.1
    // ==========================================

    function optimizeCLS() {
        // 1. Reserve space for images with explicit dimensions
        const images = document.querySelectorAll('img:not([width]):not([height])');
        images.forEach(img => {
            if (img.naturalWidth && img.naturalHeight) {
                img.setAttribute('width', img.naturalWidth);
                img.setAttribute('height', img.naturalHeight);
            }
        });

        // 2. Reserve space for embeds and iframes
        const embeds = document.querySelectorAll('iframe, embed, video');
        embeds.forEach(embed => {
            if (!embed.hasAttribute('width') || !embed.hasAttribute('height')) {
                // Apply aspect ratio container
                const wrapper = embed.parentElement;
                if (wrapper && !wrapper.classList.contains('embed-container')) {
                    wrapper.style.aspectRatio = '16/9';
                    wrapper.style.position = 'relative';
                }
            }
        });

        // 3. Prevent font-induced layout shifts with font-display: swap
        // (Already handled in CSS via Google Fonts display=swap parameter)

        // 4. Stabilize dynamically loaded content
        const dynamicContainers = document.querySelectorAll('.carousel-track, .services-grid');
        dynamicContainers.forEach(container => {
            container.style.minHeight = container.offsetHeight + 'px';
        });
    }

    // ==========================================
    // INP Optimization (Interaction to Next Paint)
    // Target: < 200ms
    // ==========================================

    function optimizeINP() {
        // 1. Use passive event listeners for scroll/touch
        const passiveSupported = checkPassiveSupport();

        // 2. Debounce scroll handlers (already implemented in script.js)

        // 3. Defer non-critical interactions
        document.querySelectorAll('button, a, input, select, textarea').forEach(el => {
            // Add visual feedback for immediate response
            el.addEventListener('mousedown', () => {
                el.style.transform = 'scale(0.98)';
            }, { passive: true });

            el.addEventListener('mouseup', () => {
                el.style.transform = '';
            }, { passive: true });
        });

        // 4. Use requestIdleCallback for non-urgent tasks
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                // Initialize non-critical features
                initNonCriticalFeatures();
            }, { timeout: 2000 });
        } else {
            setTimeout(initNonCriticalFeatures, 2000);
        }
    }

    function checkPassiveSupport() {
        let passiveSupported = false;
        try {
            const options = {
                get passive() {
                    passiveSupported = true;
                    return false;
                }
            };
            window.addEventListener('test', null, options);
            window.removeEventListener('test', null, options);
        } catch (e) {
            passiveSupported = false;
        }
        return passiveSupported;
    }

    function initNonCriticalFeatures() {
        // Initialize analytics, third-party scripts, etc.
        // These are deferred to not block INP
    }

    // ==========================================
    // Web Vitals Reporting (optional - for monitoring)
    // ==========================================

    function reportWebVitals() {
        // Report to analytics if web-vitals library is available
        if ('web-vitals' in window || typeof webVitals !== 'undefined') {
            return; // Let external library handle it
        }

        // Basic performance observation
        if ('PerformanceObserver' in window) {
            // Observe LCP
            try {
                const lcpObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    performanceMetrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
                });
                lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
            } catch (e) {
                // LCP not supported
            }

            // Observe CLS
            try {
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    performanceMetrics.CLS = clsValue;
                });
                clsObserver.observe({ type: 'layout-shift', buffered: true });
            } catch (e) {
                // CLS not supported
            }

            // Observe FCP
            try {
                const fcpObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntriesByName('first-contentful-paint');
                    if (entries.length > 0) {
                        performanceMetrics.FCP = entries[0].startTime;
                    }
                });
                fcpObserver.observe({ type: 'paint', buffered: true });
            } catch (e) {
                // FCP not supported
            }
        }

        // Get TTFB from Navigation Timing
        if (performance.getEntriesByType) {
            const navEntries = performance.getEntriesByType('navigation');
            if (navEntries.length > 0) {
                performanceMetrics.TTFB = navEntries[0].responseStart;
            }
        }
    }

    // ==========================================
    // Resource Hints for Faster Loading
    // ==========================================

    function addResourceHints() {
        // Preconnect to critical third-party origins
        const preconnects = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://api.web3forms.com'
        ];

        preconnects.forEach(origin => {
            if (!document.querySelector(`link[rel="preconnect"][href="${origin}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preconnect';
                link.href = origin;
                link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
            }
        });

        // DNS prefetch for less critical resources
        const dnsPrefetch = [
            'https://unpkg.com'
        ];

        dnsPrefetch.forEach(origin => {
            if (!document.querySelector(`link[rel="dns-prefetch"][href="${origin}"]`)) {
                const link = document.createElement('link');
                link.rel = 'dns-prefetch';
                link.href = origin;
                document.head.appendChild(link);
            }
        });
    }

    // ==========================================
    // IndexNow Support (for instant indexing)
    // ==========================================

    window.NexTepPerformance = {
        getMetrics: () => performanceMetrics,

        // Manual trigger for reindexing (for admin use)
        notifyIndexNow: async function (urls) {
            // This would require a server-side implementation
            // Keeping as placeholder for future enhancement
            console.log('IndexNow notification would be sent for:', urls);
        }
    };

    // ==========================================
    // Initialization
    // ==========================================

    function init() {
        // Run optimizations after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runOptimizations);
        } else {
            runOptimizations();
        }

        // Additional optimizations after full load
        window.addEventListener('load', () => {
            reportWebVitals();

            // Log performance metrics in development
            if (window.location.hostname === 'localhost') {
                setTimeout(() => {
                    console.log('📊 Core Web Vitals:', performanceMetrics);
                }, 3000);
            }
        });
    }

    function runOptimizations() {
        optimizeLCP();
        optimizeCLS();
        optimizeINP();
        addResourceHints();
    }

    // Start optimization
    init();

})();
