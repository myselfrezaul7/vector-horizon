/**
 * NexTep Edu - Main JavaScript
 * Robust, error-proof implementation with defensive coding
 */

(function () {
    'use strict';

    // ==========================================
    // Utility Functions
    // ==========================================

    /**
     * Safely get an element by ID with error logging
     * @param {string} id - Element ID
     * @returns {HTMLElement|null}
     */
    function safeGetById(id) {
        try {
            return document.getElementById(id);
        } catch (e) {
            console.warn(`Failed to get element with id: ${id}`, e);
            return null;
        }
    }

    /**
     * Safely query a single element
     * @param {string} selector - CSS selector
     * @param {HTMLElement} context - Context element (default: document)
     * @returns {HTMLElement|null}
     */
    function safeQuery(selector, context = document) {
        try {
            return context.querySelector(selector);
        } catch (e) {
            console.warn(`Failed to query selector: ${selector}`, e);
            return null;
        }
    }

    /**
     * Safely query all elements
     * @param {string} selector - CSS selector
     * @param {HTMLElement} context - Context element (default: document)
     * @returns {NodeList}
     */
    function safeQueryAll(selector, context = document) {
        try {
            return context.querySelectorAll(selector);
        } catch (e) {
            console.warn(`Failed to query all: ${selector}`, e);
            return [];
        }
    }

    /**
     * Safely add event listener with error handling
     * @param {HTMLElement} element - Target element
     * @param {string} event - Event type
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     */
    function safeAddListener(element, event, handler, options = {}) {
        if (!element || typeof element.addEventListener !== 'function') {
            return;
        }
        try {
            element.addEventListener(event, handler, options);
        } catch (e) {
            console.warn(`Failed to add ${event} listener`, e);
        }
    }

    /**
     * Debounce function to limit execution frequency
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function}
     */
    function debounce(func, wait = 100) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function to limit execution rate
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit in ms
     * @returns {Function}
     */
    function throttle(func, limit = 100) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ==========================================
    // Theme Management
    // ==========================================

    function initTheme() {
        const themeToggle = safeGetById('theme-toggle');
        if (!themeToggle) return;

        const htmlElement = document.documentElement;
        const icon = safeQuery('i', themeToggle);

        // Get saved theme or detect system preference
        let savedTheme = 'light';
        try {
            savedTheme = localStorage.getItem('theme') ||
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        } catch (e) {
            console.warn('localStorage not available', e);
        }

        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(icon, savedTheme);

        safeAddListener(themeToggle, 'click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            htmlElement.setAttribute('data-theme', newTheme);

            try {
                localStorage.setItem('theme', newTheme);
            } catch (e) {
                console.warn('Could not save theme preference', e);
            }

            updateThemeIcon(icon, newTheme);
        });

        // Listen for system theme changes
        try {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    const newTheme = e.matches ? 'dark' : 'light';
                    htmlElement.setAttribute('data-theme', newTheme);
                    updateThemeIcon(icon, newTheme);
                }
            });
        } catch (e) {
            // Media query listener not supported
        }
    }

    function updateThemeIcon(icon, theme) {
        if (!icon) return;

        try {
            icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }
        } catch (e) {
            console.warn('Could not update theme icon', e);
        }
    }

    // ==========================================
    // Scroll Effects
    // ==========================================

    function initScrollEffects() {
        const navbar = safeGetById('navbar');
        const scrollProgress = safeGetById('scroll-progress');
        const backToTop = safeGetById('back-to-top');

        const handleScroll = throttle(() => {
            const scrollY = window.scrollY || window.pageYOffset || 0;

            // Navbar scroll effect
            if (navbar) {
                if (scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }

            // Scroll progress bar
            if (scrollProgress) {
                try {
                    const docHeight = Math.max(
                        document.documentElement.scrollHeight - window.innerHeight,
                        1 // Prevent division by zero
                    );
                    const scrollPercent = Math.min((scrollY / docHeight) * 100, 100);
                    scrollProgress.style.width = scrollPercent + '%';
                } catch (e) {
                    // Fail silently
                }
            }

            // Back to top button visibility
            if (backToTop) {
                if (scrollY > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            }
        }, 16); // ~60fps

        safeAddListener(window, 'scroll', handleScroll, { passive: true });

        // Back to top click handler
        if (backToTop) {
            safeAddListener(backToTop, 'click', () => {
                try {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } catch (e) {
                    // Fallback for older browsers
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

        safeAddListener(menuToggle, 'click', () => {
            navLinks.classList.toggle('active');

            // Update aria-expanded for accessibility
            const isExpanded = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking outside
        safeAddListener(document, 'click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu on escape key
        safeAddListener(document, 'keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.focus();
            }
        });
    }

    // ==========================================
    // Smooth Scroll
    // ==========================================

    function initSmoothScroll() {
        const navLinks = safeQuery('.nav-links');

        safeQueryAll('a[href^="#"]').forEach(anchor => {
            safeAddListener(anchor, 'click', function (e) {
                const href = this.getAttribute('href');

                // Skip if just "#" or empty
                if (!href || href === '#') return;

                const target = safeQuery(href);
                if (target) {
                    e.preventDefault();

                    try {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    } catch (err) {
                        // Fallback
                        target.scrollIntoView();
                    }

                    // Close mobile menu if open
                    if (navLinks && navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                    }

                    // Update URL hash without jumping
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            });
        });
    }

    // ==========================================
    // Intersection Observer Animations
    // ==========================================

    function initAnimations() {
        // Check for IntersectionObserver support
        if (!('IntersectionObserver' in window)) {
            // Fallback: show all elements immediately
            safeQueryAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
                el.classList.add('visible');
            });
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, observerOptions);

        safeQueryAll('.fade-in-up, .fade-in-left, .fade-in-right').forEach(el => {
            observer.observe(el);
        });
    }

    // ==========================================
    // Preloader
    // ==========================================

    function initPreloader() {
        const preloader = safeGetById('preloader');
        if (!preloader) return;

        const hidePreloader = () => {
            preloader.classList.add('hide');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        };

        // Hide after page load
        if (document.readyState === 'complete') {
            setTimeout(hidePreloader, 300);
        } else {
            safeAddListener(window, 'load', () => {
                setTimeout(hidePreloader, 300);
            });
        }

        // Fallback: force hide after 5 seconds
        setTimeout(() => {
            if (preloader.style.display !== 'none') {
                hidePreloader();
            }
        }, 5000);
    }

    // ==========================================
    // Booking Modal
    // ==========================================

    function initBookingModal() {
        const modal = safeGetById('booking-modal');
        const openBtn = safeGetById('open-booking');
        const closeBtn = safeQuery('.close-modal');
        const bookingForm = safeGetById('booking-form');
        const timeSelect = safeGetById('time');
        const dateInput = safeGetById('date');

        if (!modal) return;

        // Open modal
        if (openBtn) {
            safeAddListener(openBtn, 'click', () => openModal(modal));
        }

        // Close modal
        if (closeBtn) {
            safeAddListener(closeBtn, 'click', () => closeModal(modal));
        }

        // Close on backdrop click
        safeAddListener(modal, 'click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });

        // Close on escape key
        safeAddListener(document, 'keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal(modal);
            }
        });

        // Populate time slots
        if (timeSelect && timeSelect.options.length === 0) {
            populateTimeSlots(timeSelect);
        }

        // Set minimum date to today
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        // Handle form submission
        if (bookingForm) {
            safeAddListener(bookingForm, 'submit', handleBookingSubmit);
        }
    }

    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Focus first input for accessibility
        const firstInput = safeQuery('input', modal);
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function populateTimeSlots(selectElement) {
        if (!selectElement) return;

        // Add placeholder option
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Select a time';
        placeholder.disabled = true;
        placeholder.selected = true;
        selectElement.appendChild(placeholder);

        // Add time slots (10 AM - 6 PM)
        for (let i = 10; i <= 18; i++) {
            const hour = i > 12 ? i - 12 : i;
            const ampm = i >= 12 ? 'PM' : 'AM';
            const timeString = `${hour}:00 ${ampm}`;

            const option = document.createElement('option');
            option.value = timeString;
            option.textContent = timeString;
            selectElement.appendChild(option);
        }
    }

    function handleBookingSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const modal = safeGetById('booking-modal');

        // Get form values safely
        const getValue = (id) => {
            const el = safeGetById(id);
            return el ? el.value.trim() : '';
        };

        const name = getValue('name');
        const email = getValue('email');
        const phone = getValue('phone');
        const date = getValue('date');
        const time = getValue('time');
        const topic = getValue('topic');

        // Basic validation
        if (!name || !email || !phone || !date || !time) {
            alert('Please fill in all required fields.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Construct mailto link
        const subject = encodeURIComponent(`Consultation Booking: ${name}`);
        const body = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nDate: ${date}\nTime: ${time}\nTopic: ${topic}\n\nPlease confirm my appointment.`
        );

        // Open email client
        try {
            window.location.href = `mailto:edunextep@gmail.com?subject=${subject}&body=${body}`;
        } catch (err) {
            console.error('Could not open email client', err);
            alert('Could not open email client. Please contact us directly at edunextep@gmail.com');
        }

        closeModal(modal);
        form.reset();
    }

    // ==========================================
    // Carousel
    // ==========================================

    function initCarousel() {
        const track = safeGetById('testimonial-track');
        const prevBtn = safeQuery('.carousel-btn.prev');
        const nextBtn = safeQuery('.carousel-btn.next');

        if (!track) return;

        const scrollAmount = 320; // Approximate card width + gap

        if (nextBtn) {
            safeAddListener(nextBtn, 'click', () => {
                try {
                    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                } catch (e) {
                    track.scrollLeft += scrollAmount;
                }
            });
        }

        if (prevBtn) {
            safeAddListener(prevBtn, 'click', () => {
                try {
                    track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                } catch (e) {
                    track.scrollLeft -= scrollAmount;
                }
            });
        }

        // Auto-scroll functionality
        let autoScrollInterval;

        const startAutoScroll = () => {
            autoScrollInterval = setInterval(() => {
                const maxScroll = track.scrollWidth - track.clientWidth;
                if (track.scrollLeft >= maxScroll - 10) {
                    track.scrollLeft = 0;
                } else {
                    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }, 5000);
        };

        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };

        // Start auto-scroll
        startAutoScroll();

        // Pause on hover or touch
        safeAddListener(track, 'mouseenter', stopAutoScroll);
        safeAddListener(track, 'mouseleave', startAutoScroll);
        safeAddListener(track, 'touchstart', stopAutoScroll, { passive: true });
        safeAddListener(track, 'touchend', startAutoScroll);
    }

    // ==========================================
    // Initialize Everything
    // ==========================================

    function init() {
        try {
            initTheme();
            initScrollEffects();
            initMobileMenu();
            initSmoothScroll();
            initAnimations();
            initPreloader();
            initBookingModal();
            initCarousel();

            // Initialize Lucide icons
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                lucide.createIcons();
            }

            console.log('NexTep Edu: All modules initialized successfully');
        } catch (e) {
            console.error('NexTep Edu: Initialization error', e);
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
