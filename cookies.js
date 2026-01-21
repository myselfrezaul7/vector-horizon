/**
 * NexTep Edu - Cookie Consent & Management System
 * GDPR-compliant cookie consent with user preference tracking
 */

(function () {
    'use strict';

    // ==========================================
    // Cookie Configuration
    // ==========================================

    const COOKIE_CONFIG = {
        consentCookie: 'nextep_cookie_consent',
        consentExpiry: 365, // Days until consent expires

        // Necessary cookies that are always set (essential for site operation)
        necessaryCookies: {
            theme: {
                name: 'nextep_theme',
                description: 'Stores your dark/light mode preference',
                expiry: 365
            },
            sessionId: {
                name: 'nextep_session',
                description: 'Anonymous session identifier for site functionality',
                expiry: 1 // Session cookie, expires at end of day
            },
            cookieConsent: {
                name: 'nextep_cookie_consent',
                description: 'Remembers your cookie preferences',
                expiry: 365
            }
        },

        // Analytics/tracking cookies (optional - only with full consent)
        analyticsCookies: {
            visitCount: {
                name: 'nextep_visits',
                description: 'Tracks number of visits for user engagement',
                expiry: 365
            },
            lastVisit: {
                name: 'nextep_last_visit',
                description: 'Remembers your last visit date',
                expiry: 365
            },
            userHabits: {
                name: 'nextep_habits',
                description: 'Stores anonymous browsing patterns for site improvement',
                expiry: 30
            },
            pageViews: {
                name: 'nextep_page_views',
                description: 'Tracks pages visited for content optimization',
                expiry: 30
            },
            referrer: {
                name: 'nextep_referrer',
                description: 'Remembers how you found our site',
                expiry: 7
            },
            formInteraction: {
                name: 'nextep_form_interaction',
                description: 'Tracks form interactions for UX improvement',
                expiry: 30
            }
        }
    };

    // ==========================================
    // Cookie Utility Functions
    // ==========================================

    /**
     * Set a cookie with given name, value, and expiry days
     */
    function setCookie(name, value, days) {
        try {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = 'expires=' + date.toUTCString();
            const secure = location.protocol === 'https:' ? '; Secure' : '';
            document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax${secure}`;
            return true;
        } catch (e) {
            console.warn('Failed to set cookie:', name, e);
            return false;
        }
    }

    /**
     * Get a cookie value by name
     */
    function getCookie(name) {
        try {
            const nameEQ = name + '=';
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                if (cookie.indexOf(nameEQ) === 0) {
                    return decodeURIComponent(cookie.substring(nameEQ.length));
                }
            }
            return null;
        } catch (e) {
            console.warn('Failed to get cookie:', name, e);
            return null;
        }
    }

    /**
     * Delete a cookie by name
     */
    function deleteCookie(name) {
        try {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            return true;
        } catch (e) {
            console.warn('Failed to delete cookie:', name, e);
            return false;
        }
    }

    /**
     * Delete all cookies set by this site
     */
    function deleteAllCookies() {
        // Delete analytics cookies
        Object.values(COOKIE_CONFIG.analyticsCookies).forEach(cookie => {
            deleteCookie(cookie.name);
        });
    }

    // ==========================================
    // Consent Management
    // ==========================================

    /**
     * Check if user has already given consent
     */
    function hasConsent() {
        return getCookie(COOKIE_CONFIG.consentCookie) !== null;
    }

    /**
     * Get consent type ('necessary' or 'rejected')
     */
    function getConsentType() {
        return getCookie(COOKIE_CONFIG.consentCookie);
    }

    /**
     * Save consent choice
     */
    function saveConsent(type) {
        setCookie(COOKIE_CONFIG.consentCookie, type, COOKIE_CONFIG.consentExpiry);

        if (type === 'necessary') {
            // Set necessary cookies
            setNecessaryCookies();
        } else if (type === 'rejected') {
            // Delete all non-essential cookies
            deleteAllCookies();
            // Only set the consent cookie itself
            setCookie(COOKIE_CONFIG.consentCookie, 'rejected', COOKIE_CONFIG.consentExpiry);
        }

        hideCookieBanner();

        // Dispatch event for other scripts to respond
        window.dispatchEvent(new CustomEvent('cookieConsentChanged', {
            detail: { consent: type }
        }));
    }

    // ==========================================
    // Necessary Cookies (Always Set)
    // ==========================================

    function setNecessaryCookies() {
        // Theme preference (synced from localStorage)
        try {
            const theme = localStorage.getItem('theme') || 'light';
            setCookie(COOKIE_CONFIG.necessaryCookies.theme.name, theme,
                COOKIE_CONFIG.necessaryCookies.theme.expiry);
        } catch (e) {
            // localStorage not available
        }

        // Session identifier
        let sessionId = getCookie(COOKIE_CONFIG.necessaryCookies.sessionId.name);
        if (!sessionId) {
            sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            setCookie(COOKIE_CONFIG.necessaryCookies.sessionId.name, sessionId,
                COOKIE_CONFIG.necessaryCookies.sessionId.expiry);
        }
    }

    // ==========================================
    // User Habit Tracking (Only with Consent)
    // ==========================================

    function initUserTracking() {
        // Only track if user accepted necessary cookies (not rejected)
        if (getConsentType() === 'rejected') return;

        // Visit count
        let visits = parseInt(getCookie(COOKIE_CONFIG.analyticsCookies.visitCount.name)) || 0;
        visits++;
        setCookie(COOKIE_CONFIG.analyticsCookies.visitCount.name, visits.toString(),
            COOKIE_CONFIG.analyticsCookies.visitCount.expiry);

        // Last visit timestamp
        setCookie(COOKIE_CONFIG.analyticsCookies.lastVisit.name, new Date().toISOString(),
            COOKIE_CONFIG.analyticsCookies.lastVisit.expiry);

        // Referrer (only on first visit)
        if (!getCookie(COOKIE_CONFIG.analyticsCookies.referrer.name) && document.referrer) {
            setCookie(COOKIE_CONFIG.analyticsCookies.referrer.name, document.referrer,
                COOKIE_CONFIG.analyticsCookies.referrer.expiry);
        }

        // Page views tracking
        trackPageView();

        // User habits tracking
        trackUserHabits();

        // Form interaction tracking
        trackFormInteractions();
    }

    function trackPageView() {
        if (getConsentType() === 'rejected') return;

        try {
            let pageViews = JSON.parse(getCookie(COOKIE_CONFIG.analyticsCookies.pageViews.name) || '[]');
            const currentPage = window.location.pathname;

            // Add current page if not already tracked in this session
            const existingIndex = pageViews.findIndex(p => p.page === currentPage);
            if (existingIndex >= 0) {
                pageViews[existingIndex].count++;
                pageViews[existingIndex].lastVisit = Date.now();
            } else {
                pageViews.push({
                    page: currentPage,
                    count: 1,
                    firstVisit: Date.now(),
                    lastVisit: Date.now()
                });
            }

            // Keep only last 20 pages
            if (pageViews.length > 20) {
                pageViews = pageViews.slice(-20);
            }

            setCookie(COOKIE_CONFIG.analyticsCookies.pageViews.name, JSON.stringify(pageViews),
                COOKIE_CONFIG.analyticsCookies.pageViews.expiry);
        } catch (e) {
            console.warn('Failed to track page view:', e);
        }
    }

    function trackUserHabits() {
        if (getConsentType() === 'rejected') return;

        try {
            let habits = JSON.parse(getCookie(COOKIE_CONFIG.analyticsCookies.userHabits.name) || '{}');

            // Time of visit
            const hour = new Date().getHours();
            const timeSlot = hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
            habits.preferredTime = habits.preferredTime || {};
            habits.preferredTime[timeSlot] = (habits.preferredTime[timeSlot] || 0) + 1;

            // Device type
            const isMobile = window.innerWidth <= 768;
            habits.deviceType = habits.deviceType || {};
            habits.deviceType[isMobile ? 'mobile' : 'desktop'] = (habits.deviceType[isMobile ? 'mobile' : 'desktop'] || 0) + 1;

            // Scroll depth tracking (will be updated on scroll)
            habits.avgScrollDepth = habits.avgScrollDepth || 0;

            // Session count
            habits.sessionCount = (habits.sessionCount || 0) + 1;

            // Total time spent (approximation)
            habits.totalTimeSpent = habits.totalTimeSpent || 0;

            setCookie(COOKIE_CONFIG.analyticsCookies.userHabits.name, JSON.stringify(habits),
                COOKIE_CONFIG.analyticsCookies.userHabits.expiry);

            // Track scroll depth
            trackScrollDepth(habits);

            // Track time spent on page
            trackTimeSpent(habits);
        } catch (e) {
            console.warn('Failed to track user habits:', e);
        }
    }

    function trackScrollDepth(habits) {
        if (getConsentType() === 'rejected') return;

        let maxScroll = 0;

        const handleScroll = () => {
            const scrollTop = window.scrollY || window.pageYOffset;
            const docHeight = Math.max(
                document.documentElement.scrollHeight - window.innerHeight,
                1
            );
            const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
            maxScroll = Math.max(maxScroll, scrollPercent);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Save on page unload
        window.addEventListener('beforeunload', () => {
            try {
                let currentHabits = JSON.parse(getCookie(COOKIE_CONFIG.analyticsCookies.userHabits.name) || '{}');
                const prevAvg = currentHabits.avgScrollDepth || 0;
                const sessions = currentHabits.sessionCount || 1;
                currentHabits.avgScrollDepth = Math.round((prevAvg * (sessions - 1) + maxScroll) / sessions);
                setCookie(COOKIE_CONFIG.analyticsCookies.userHabits.name, JSON.stringify(currentHabits),
                    COOKIE_CONFIG.analyticsCookies.userHabits.expiry);
            } catch (e) {
                // Silent fail on unload
            }
        });
    }

    function trackTimeSpent(habits) {
        if (getConsentType() === 'rejected') return;

        const startTime = Date.now();

        window.addEventListener('beforeunload', () => {
            try {
                const timeSpent = Math.round((Date.now() - startTime) / 1000); // in seconds
                let currentHabits = JSON.parse(getCookie(COOKIE_CONFIG.analyticsCookies.userHabits.name) || '{}');
                currentHabits.totalTimeSpent = (currentHabits.totalTimeSpent || 0) + timeSpent;
                currentHabits.lastSessionDuration = timeSpent;
                setCookie(COOKIE_CONFIG.analyticsCookies.userHabits.name, JSON.stringify(currentHabits),
                    COOKIE_CONFIG.analyticsCookies.userHabits.expiry);
            } catch (e) {
                // Silent fail on unload
            }
        });
    }

    function trackFormInteractions() {
        if (getConsentType() === 'rejected') return;

        try {
            let formData = JSON.parse(getCookie(COOKIE_CONFIG.analyticsCookies.formInteraction.name) || '{}');

            // Track booking form interactions
            const bookingForm = document.getElementById('booking-form');
            if (bookingForm) {
                bookingForm.addEventListener('submit', () => {
                    formData.bookingSubmissions = (formData.bookingSubmissions || 0) + 1;
                    formData.lastBookingAttempt = Date.now();
                    setCookie(COOKIE_CONFIG.analyticsCookies.formInteraction.name, JSON.stringify(formData),
                        COOKIE_CONFIG.analyticsCookies.formInteraction.expiry);
                });

                // Track modal opens
                const openBookingBtn = document.getElementById('open-booking');
                if (openBookingBtn) {
                    openBookingBtn.addEventListener('click', () => {
                        formData.modalOpens = (formData.modalOpens || 0) + 1;
                        setCookie(COOKIE_CONFIG.analyticsCookies.formInteraction.name, JSON.stringify(formData),
                            COOKIE_CONFIG.analyticsCookies.formInteraction.expiry);
                    });
                }
            }

            // Track CTA button clicks
            document.querySelectorAll('.btn-primary').forEach(btn => {
                btn.addEventListener('click', () => {
                    formData.ctaClicks = (formData.ctaClicks || 0) + 1;
                    setCookie(COOKIE_CONFIG.analyticsCookies.formInteraction.name, JSON.stringify(formData),
                        COOKIE_CONFIG.analyticsCookies.formInteraction.expiry);
                });
            });
        } catch (e) {
            console.warn('Failed to setup form tracking:', e);
        }
    }

    // ==========================================
    // Cookie Banner UI
    // ==========================================

    function createCookieBanner() {
        // Don't show if already consented
        if (hasConsent()) {
            // Initialize tracking if user previously accepted
            if (getConsentType() === 'necessary') {
                setNecessaryCookies();
                initUserTracking();
            }
            return;
        }

        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-consent-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-labelledby', 'cookie-consent-title');
        banner.setAttribute('aria-describedby', 'cookie-consent-description');

        banner.innerHTML = `
            <div class="cookie-consent-content">
                <div class="cookie-consent-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                        <circle cx="12" cy="17" r=".5"/>
                    </svg>
                </div>
                <div class="cookie-consent-text">
                    <h3 id="cookie-consent-title">🍪 Cookie Settings</h3>
                    <p id="cookie-consent-description">
                        We use cookies to ensure you have the best browsing experience, remember your preferences, 
                        and understand how you use our site. You can choose to accept only essential cookies or 
                        reject all optional cookies.
                    </p>
                    <details class="cookie-details">
                        <summary>Learn more about our cookies</summary>
                        <div class="cookie-info">
                            <div class="cookie-category">
                                <h4>🔒 Essential Cookies</h4>
                                <p>Required for basic site functionality like saving your theme preference and session management.</p>
                            </div>
                            <div class="cookie-category">
                                <h4>📊 Analytics Cookies</h4>
                                <p>Help us understand how visitors interact with our website, allowing us to improve your experience. 
                                These track visit counts, page views, and anonymous browsing patterns.</p>
                            </div>
                        </div>
                    </details>
                </div>
                <div class="cookie-consent-actions">
                    <button type="button" class="cookie-btn cookie-btn-accept" id="cookie-accept-necessary">
                        <span>Accept Necessary Only</span>
                    </button>
                    <button type="button" class="cookie-btn cookie-btn-reject" id="cookie-reject-all">
                        <span>Reject All</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // Add event listeners
        document.getElementById('cookie-accept-necessary').addEventListener('click', () => {
            saveConsent('necessary');
            initUserTracking();
        });

        document.getElementById('cookie-reject-all').addEventListener('click', () => {
            saveConsent('rejected');
        });

        // Show banner with animation
        requestAnimationFrame(() => {
            banner.classList.add('show');
        });
    }

    function hideCookieBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('show');
            banner.classList.add('hide');
            setTimeout(() => {
                banner.remove();
            }, 500);
        }
    }

    // ==========================================
    // Initialization
    // ==========================================

    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createCookieBanner);
        } else {
            createCookieBanner();
        }
    }

    // ==========================================
    // Public API
    // ==========================================

    window.NexTepCookies = {
        hasConsent,
        getConsentType,
        getCookie,
        setCookie,
        deleteCookie,
        deleteAllCookies,
        showConsentBanner: createCookieBanner,

        // Utility to get user stats (for internal use)
        getUserStats: function () {
            if (getConsentType() === 'rejected') return null;

            return {
                visits: parseInt(getCookie(COOKIE_CONFIG.analyticsCookies.visitCount.name)) || 0,
                lastVisit: getCookie(COOKIE_CONFIG.analyticsCookies.lastVisit.name),
                habits: JSON.parse(getCookie(COOKIE_CONFIG.analyticsCookies.userHabits.name) || '{}'),
                pageViews: JSON.parse(getCookie(COOKIE_CONFIG.analyticsCookies.pageViews.name) || '[]'),
                formInteractions: JSON.parse(getCookie(COOKIE_CONFIG.analyticsCookies.formInteraction.name) || '{}')
            };
        },

        // Revoke consent and show banner again
        revokeConsent: function () {
            deleteCookie(COOKIE_CONFIG.consentCookie);
            deleteAllCookies();
            createCookieBanner();
        }
    };

    // Initialize
    init();

})();
