/**
 * NexTep Edu - Destination Pages Common Script
 * Lightweight, robust implementation for destination pages
 */

(function () {
    'use strict';

    // ==========================================
    // Utility Functions
    // ==========================================

    function safeGetById(id) {
        try {
            return document.getElementById(id);
        } catch (e) {
            return null;
        }
    }

    function safeQuery(selector) {
        try {
            return document.querySelector(selector);
        } catch (e) {
            return null;
        }
    }

    function safeQueryAll(selector) {
        try {
            return document.querySelectorAll(selector);
        } catch (e) {
            return [];
        }
    }

    // ==========================================
    // Initialization
    // ==========================================

    function init() {
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Dynamic footer year
        const yearEl = safeGetById('footer-year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();

        initTheme();
        initScrollEffects();
        initMobileMenu();
        initAnimations();
        initUniversityAccordion();
    }

    // ==========================================
    // University Accordion
    // ==========================================

    function initUniversityAccordion() {
        const headers = safeQueryAll('.university-header');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                item.classList.toggle('active');
            });
        });
    }

    // ==========================================
    // Theme Toggle
    // ==========================================

    function initTheme() {
        const themeToggle = safeGetById('theme-toggle');
        const htmlElement = document.documentElement;

        if (!themeToggle) return;

        const icon = themeToggle.querySelector('i');
        let savedTheme = 'light';

        try {
            savedTheme = localStorage.getItem('theme') ||
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        } catch (e) { }

        htmlElement.setAttribute('data-theme', savedTheme);
        updateIcon(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            htmlElement.setAttribute('data-theme', newTheme);
            try {
                localStorage.setItem('theme', newTheme);
            } catch (e) { }
            updateIcon(newTheme);
        });

        function updateIcon(theme) {
            if (icon) {
                icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }
    }

    // ==========================================
    // Scroll Effects
    // ==========================================

    function initScrollEffects() {
        const navbar = safeGetById('navbar');
        const backToTop = safeGetById('back-to-top');

        // Throttle scroll handler
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY || 0;

                    if (navbar) {
                        navbar.classList.toggle('scrolled', scrollY > 50);
                    }

                    if (backToTop) {
                        backToTop.classList.toggle('visible', scrollY > 300);
                    }

                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Back to top click
        if (backToTop) {
            backToTop.addEventListener('click', () => {
                try {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } catch (e) {
                    window.scrollTo(0, 0);
                }
            });
        }
    }

    // ==========================================
    // Mobile Menu
    // ==========================================

    function initMobileMenu() {
        const menuToggle = safeQuery('.menu-toggle');
        const navLinks = safeQuery('.nav-links');

        if (!menuToggle || !navLinks) return;

        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ==========================================
    // Fade-in Animations
    // ==========================================

    function initAnimations() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            safeQueryAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
                observer.observe(el);
            });
        } else {
            // Fallback: show all immediately
            safeQueryAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
                el.classList.add('visible');
            });
        }
    }

    // ==========================================
    // Run on DOM Ready
    // ==========================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
