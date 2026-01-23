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
        const dropdown = safeQuery('.dropdown');
        const dropbtn = safeQuery('.dropbtn');

        if (!menuToggle || !navLinks) return;

        safeAddListener(menuToggle, 'click', () => {
            navLinks.classList.toggle('active');

            // Update aria-expanded for accessibility
            const isExpanded = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Mobile dropdown toggle
        if (dropbtn && dropdown) {
            safeAddListener(dropbtn, 'click', (e) => {
                // Handle dropdown toggle on click (primarily for mobile/touch)
                if (window.getComputedStyle(menuToggle).display !== 'none') {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdown.classList.toggle('active');

                    // Rotate the chevron icon
                    const icon = safeQuery('i', dropbtn);
                    if (icon) {
                        icon.style.transform = dropdown.classList.contains('active')
                            ? 'rotate(180deg)'
                            : 'rotate(0deg)';
                    }
                }
            });
        }

        // Close menu when clicking outside
        safeAddListener(document, 'click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }

            // Close dropdown if clicking outside of it
            if (dropdown && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
                const icon = safeQuery('i', dropbtn);
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        });

        // Close menu on escape key
        safeAddListener(document, 'keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.focus();

                // Also close dropdown
                if (dropdown) {
                    dropdown.classList.remove('active');
                    const icon = safeQuery('i', dropbtn);
                    if (icon) icon.style.transform = 'rotate(0deg)';
                }
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

        // Record form open time for security (bot detection)
        if (window.NexTepSecurity) {
            window.NexTepSecurity.recordFormOpen();
        }

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

    async function handleBookingSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const modal = safeGetById('booking-modal');
        const submitBtn = form.querySelector('button[type="submit"]');

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
        const educationLevel = getValue('education-level');
        const topic = getValue('topic');

        // ==========================================
        // Security Checks (if security module loaded)
        // ==========================================
        if (window.NexTepSecurity) {
            const formData = { name, email, phone, date, time, educationLevel, topic };
            const securityCheck = window.NexTepSecurity.performSecurityChecks(form, formData);

            if (!securityCheck.passed) {
                if (securityCheck.isBot) {
                    // Silent failure for bots - pretend success
                    showFormSuccess('🎉 Booking confirmed! We will contact you soon.');
                    closeModal(modal);
                    form.reset();
                    return;
                }
                if (securityCheck.error) {
                    showFormError(securityCheck.error);
                }
                return;
            }
        }

        // Basic validation
        if (!name || !email || !phone || !date || !time || !educationLevel) {
            showFormError('Please fill in all required fields.');
            return;
        }

        // Name validation (at least 2 words)
        if (name.split(' ').filter(w => w.length > 0).length < 2) {
            showFormError('Please enter your full name (first and last name).');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormError('Please enter a valid email address.');
            return;
        }

        // Phone validation (Bangladeshi and international formats)
        const phoneClean = phone.replace(/[\s\-\(\)]/g, '');
        const phoneRegex = /^(\+?880|0)?1[3-9]\d{8}$|^\+?[1-9]\d{6,14}$/;
        if (!phoneRegex.test(phoneClean)) {
            showFormError('Please enter a valid phone number (e.g., 01XXX-XXXXXX or +880...).');
            return;
        }

        // Date validation - prevent past dates
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            showFormError('Please select a future date for your consultation.');
            return;
        }

        // Prevent dates more than 3 months in advance
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        if (selectedDate > maxDate) {
            showFormError('Please select a date within the next 3 months.');
            return;
        }

        // Format date for display (DD/MM/YYYY)
        let formattedDate = date;
        try {
            const dateObj = new Date(date);
            if (!isNaN(dateObj.getTime())) {
                const day = String(dateObj.getDate()).padStart(2, '0');
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const year = dateObj.getFullYear();
                formattedDate = `${day}/${month}/${year}`;
            }
        } catch (e) {
            // Use original date string if parsing fails
        }

        // Sanitize inputs if security module available
        const sanitizedName = window.NexTepSecurity ? window.NexTepSecurity.sanitizeInput(name) : name;
        const sanitizedEmail = window.NexTepSecurity ? window.NexTepSecurity.sanitizeInput(email) : email;

        // Show loading state with spinner
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.classList.add('btn-loading');
        submitBtn.disabled = true;

        // Prepare form data for Web3Forms
        const formDataObj = new FormData(form);
        formDataObj.set('name', sanitizedName);
        formDataObj.set('email', sanitizedEmail);
        formDataObj.set('phone', phoneClean);
        formDataObj.set('date', formattedDate);
        formDataObj.set('time', time);
        formDataObj.set('education_level', educationLevel);
        formDataObj.set('topic', topic);

        // Remove honeypot field from submission
        formDataObj.delete('website_url');

        // Submit with retry logic
        const submitWithRetry = async (retries = 1) => {
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formDataObj
                });

                if (!response.ok && retries > 0) {
                    // Wait 2 seconds before retry
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    return submitWithRetry(retries - 1);
                }

                const result = await response.json();

                if (result.success) {
                    // Record submission for rate limiting
                    if (window.NexTepSecurity) {
                        window.NexTepSecurity.addSubmission();
                    }
                    showFormSuccess('🎉 Booking confirmed! We will contact you soon.');
                    closeModal(modal);
                    form.reset();
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            } catch (error) {
                if (retries > 0) {
                    // Retry on network errors
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    return submitWithRetry(retries - 1);
                }
                console.error('Form submission error:', error);
                showFormError('Sorry, there was an error sending your booking. Please try again or contact us directly via WhatsApp.');
            }
        };

        try {
            await submitWithRetry(1);
        } finally {
            // Reset button state
            submitBtn.textContent = originalBtnText;
            submitBtn.classList.remove('btn-loading');
            submitBtn.disabled = false;
        }
    }

    // ==========================================
    // Toast Notification System
    // ==========================================

    /**
     * Create and manage toast notifications
     */
    const toastManager = {
        container: null,
        queue: [],
        maxVisible: 3,

        init: function () {
            if (this.container) return;

            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.setAttribute('aria-live', 'polite');
            this.container.setAttribute('aria-atomic', 'true');
            document.body.appendChild(this.container);
        },

        show: function (message, type = 'info', duration = 5000) {
            this.init();

            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.setAttribute('role', 'alert');

            const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';

            toast.innerHTML = `
                <span class="toast-icon">${icon}</span>
                <span class="toast-message">${this.escapeHtml(message)}</span>
                <button class="toast-close" aria-label="Close notification">&times;</button>
            `;

            // Add close button handler
            const closeBtn = toast.querySelector('.toast-close');
            closeBtn.addEventListener('click', () => this.dismiss(toast));

            this.container.appendChild(toast);

            // Trigger animation
            requestAnimationFrame(() => {
                toast.classList.add('toast-show');
            });

            // Auto-dismiss
            const dismissTimer = setTimeout(() => this.dismiss(toast), duration);
            toast._dismissTimer = dismissTimer;

            // Pause timer on hover
            toast.addEventListener('mouseenter', () => {
                clearTimeout(toast._dismissTimer);
            });

            toast.addEventListener('mouseleave', () => {
                toast._dismissTimer = setTimeout(() => this.dismiss(toast), 2000);
            });

            return toast;
        },

        dismiss: function (toast) {
            if (!toast || toast._dismissed) return;
            toast._dismissed = true;

            clearTimeout(toast._dismissTimer);
            toast.classList.remove('toast-show');
            toast.classList.add('toast-hide');

            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        },

        escapeHtml: function (text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    };

    /**
     * Show form error message with toast notification
     * @param {string} message - Error message to display
     */
    function showFormError(message) {
        toastManager.show(message, 'error', 6000);
    }

    /**
     * Show form success message with toast notification
     * @param {string} message - Success message to display
     */
    function showFormSuccess(message) {
        toastManager.show(message, 'success', 5000);
    }

    /**
     * Show info toast
     * @param {string} message - Info message to display
     */
    function showToast(message, type = 'info') {
        toastManager.show(message, type);
    }

    // ==========================================
    // Global Error Handling
    // ==========================================

    /**
     * Global error handler for unhandled exceptions
     */
    window.addEventListener('error', function (event) {
        console.error('Unhandled error:', event.error);
        // Don't show toast for script loading errors
        if (event.filename && !event.filename.includes(window.location.hostname)) {
            return;
        }
    });

    /**
     * Handle unhandled promise rejections
     */
    window.addEventListener('unhandledrejection', function (event) {
        console.error('Unhandled promise rejection:', event.reason);
        event.preventDefault(); // Prevent console error
    });

    /**
     * Network status detection
     */
    let wasOffline = false;

    window.addEventListener('online', function () {
        if (wasOffline) {
            showToast('Connection restored! 🌐', 'success');
            wasOffline = false;
        }
    });

    window.addEventListener('offline', function () {
        wasOffline = true;
        showToast('You appear to be offline. Some features may not work.', 'error');
    });

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
        safeAddListener(track, 'touchend', () => {
            // Delay restart to allow swipe completion
            setTimeout(startAutoScroll, 1000);
        });

        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        let isSwiping = false;

        safeAddListener(track, 'touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            isSwiping = true;
        }, { passive: true });

        safeAddListener(track, 'touchmove', (e) => {
            if (!isSwiping) return;
            touchEndX = e.changedTouches[0].screenX;
        }, { passive: true });

        safeAddListener(track, 'touchend', () => {
            if (!isSwiping) return;
            isSwiping = false;

            const swipeDistance = touchStartX - touchEndX;
            const minSwipeDistance = 50; // Minimum swipe distance to trigger

            if (Math.abs(swipeDistance) > minSwipeDistance) {
                if (swipeDistance > 0) {
                    // Swipe left - go to next
                    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                } else {
                    // Swipe right - go to previous
                    track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                }
            }
        }, { passive: true });
    }

    // ==========================================
    // FAQ Accordion
    // ==========================================

    function initFAQ() {
        const faqItems = safeQueryAll('.faq-item');

        if (faqItems.length === 0) return;

        faqItems.forEach(item => {
            const question = safeQuery('.faq-question', item);

            if (question) {
                safeAddListener(question, 'click', () => {
                    const isActive = item.classList.contains('active');

                    // Close all other FAQ items (optional: remove this for multiple open)
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                            const otherQuestion = safeQuery('.faq-question', otherItem);
                            if (otherQuestion) {
                                otherQuestion.setAttribute('aria-expanded', 'false');
                            }
                        }
                    });

                    // Toggle current item
                    item.classList.toggle('active');
                    question.setAttribute('aria-expanded', !isActive);
                });
            }
        });
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
            initFAQ();

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
