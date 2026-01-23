/**
 * NexTep Edu - Security Utilities
 * Bot protection, XSS prevention, CSRF protection, and rate limiting
 */

(function () {
    'use strict';

    // ==========================================
    // Security Configuration
    // ==========================================

    const SECURITY_CONFIG = {
        // Rate limiting: max submissions per time window
        maxSubmissions: 3,
        rateLimitWindowMs: 5 * 60 * 1000, // 5 minutes

        // Suspicious patterns
        minSubmitTimeMs: 2000, // Minimum 2 seconds to fill form (humans take longer)

        // Honeypot field name
        honeypotFieldName: 'website_url',

        // Input length limits (prevent buffer overflow attacks)
        maxInputLengths: {
            name: 100,
            email: 254,
            phone: 20,
            message: 2000,
            default: 500
        },

        // CSRF token settings
        csrfTokenName: 'nextep_csrf_token',
        csrfTokenExpiry: 30 * 60 * 1000 // 30 minutes
    };

    // ==========================================
    // Rate Limiting
    // ==========================================

    const rateLimitStore = {
        submissions: [],

        addSubmission: function () {
            const now = Date.now();
            // Remove old entries outside the time window
            this.submissions = this.submissions.filter(
                time => now - time < SECURITY_CONFIG.rateLimitWindowMs
            );
            this.submissions.push(now);
        },

        isRateLimited: function () {
            const now = Date.now();
            const recentSubmissions = this.submissions.filter(
                time => now - time < SECURITY_CONFIG.rateLimitWindowMs
            );
            return recentSubmissions.length >= SECURITY_CONFIG.maxSubmissions;
        },

        getWaitTime: function () {
            if (this.submissions.length === 0) return 0;
            const oldestInWindow = Math.min(...this.submissions);
            const waitMs = (oldestInWindow + SECURITY_CONFIG.rateLimitWindowMs) - Date.now();
            return Math.max(0, Math.ceil(waitMs / 60000)); // Return minutes
        }
    };

    // ==========================================
    // XSS Protection
    // ==========================================

    /**
     * Sanitize input to prevent XSS attacks
     * @param {string} input - User input
     * @returns {string} Sanitized input
     */
    function sanitizeInput(input) {
        if (typeof input !== 'string') return '';

        // Remove script tags and event handlers
        let sanitized = input
            // Remove script tags
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            // Remove event handlers (onclick, onerror, etc.)
            .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
            .replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')
            // Remove javascript: URLs
            .replace(/javascript\s*:/gi, '')
            // Remove data: URLs that could contain scripts
            .replace(/data\s*:\s*text\/html/gi, '')
            // Encode HTML entities for remaining special chars
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        return sanitized.trim();
    }

    /**
     * Validate that input doesn't contain malicious patterns
     * @param {string} input - User input
     * @returns {boolean} True if input is safe
     */
    function isInputSafe(input) {
        if (typeof input !== 'string') return true;

        const dangerousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /<iframe/i,
            /<object/i,
            /<embed/i,
            /expression\s*\(/i,
            /data:text\/html/i
        ];

        return !dangerousPatterns.some(pattern => pattern.test(input));
    }

    // ==========================================
    // Honeypot Protection
    // ==========================================

    /**
     * Check if honeypot field was filled (indicates bot)
     * @param {HTMLFormElement} form - Form element
     * @returns {boolean} True if honeypot was triggered (is a bot)
     */
    function isHoneypotTriggered(form) {
        const honeypotField = form.querySelector(`[name="${SECURITY_CONFIG.honeypotFieldName}"]`);
        if (!honeypotField) return false;

        // If honeypot has any value, it's a bot
        return honeypotField.value.length > 0;
    }

    // ==========================================
    // Bot Detection
    // ==========================================

    let formOpenTime = null;

    /**
     * Record when form became visible
     */
    function recordFormOpen() {
        formOpenTime = Date.now();
    }

    /**
     * Check if form was submitted too quickly (bot behavior)
     * @returns {boolean} True if submission is suspiciously fast
     */
    function isSubmissionTooFast() {
        if (!formOpenTime) return false;
        const timeSinceOpen = Date.now() - formOpenTime;
        return timeSinceOpen < SECURITY_CONFIG.minSubmitTimeMs;
    }

    // ==========================================
    // Comprehensive Security Check
    // ==========================================

    /**
     * Perform all security checks before form submission
     * @param {HTMLFormElement} form - Form element
     * @param {Object} formData - Form field values
     * @returns {{passed: boolean, error: string|null}}
     */
    function performSecurityChecks(form, formData) {
        // Check 1: Rate limiting
        if (rateLimitStore.isRateLimited()) {
            const waitMinutes = rateLimitStore.getWaitTime();
            return {
                passed: false,
                error: `Too many submissions. Please wait ${waitMinutes} minute(s) before trying again.`
            };
        }

        // Check 2: Honeypot
        if (isHoneypotTriggered(form)) {
            // Silently fail for bots - don't give them feedback
            console.warn('Security: Honeypot triggered');
            return {
                passed: false,
                error: null, // Silent failure
                isBot: true
            };
        }

        // Check 3: Too fast submission
        if (isSubmissionTooFast()) {
            console.warn('Security: Submission too fast');
            return {
                passed: false,
                error: 'Please take a moment to review your information before submitting.'
            };
        }

        // Check 4: XSS in form data
        for (const [key, value] of Object.entries(formData)) {
            if (!isInputSafe(value)) {
                console.warn(`Security: Dangerous input detected in field ${key}`);
                return {
                    passed: false,
                    error: 'Invalid characters detected. Please remove special characters and try again.'
                };
            }
        }

        // Check 5: Input length validation
        for (const [key, value] of Object.entries(formData)) {
            const maxLength = SECURITY_CONFIG.maxInputLengths[key] || SECURITY_CONFIG.maxInputLengths.default;
            if (typeof value === 'string' && value.length > maxLength) {
                console.warn(`Security: Input too long in field ${key}`);
                return {
                    passed: false,
                    error: `The ${key} field is too long. Please shorten your input.`
                };
            }
        }

        return { passed: true, error: null };
    }

    /**
     * Sanitize all form data
     * @param {Object} formData - Form field values
     * @returns {Object} Sanitized form data
     */
    function sanitizeFormData(formData) {
        const sanitized = {};
        for (const [key, value] of Object.entries(formData)) {
            sanitized[key] = sanitizeInput(value);
        }
        return sanitized;
    }

    // ==========================================
    // CSRF Token Protection
    // ==========================================

    /**
     * Generate a cryptographically secure random token
     * @returns {string} Random token
     */
    function generateToken() {
        const array = new Uint8Array(32);
        if (window.crypto && window.crypto.getRandomValues) {
            window.crypto.getRandomValues(array);
        } else {
            // Fallback for older browsers
            for (let i = 0; i < 32; i++) {
                array[i] = Math.floor(Math.random() * 256);
            }
        }
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Get or create CSRF token
     * @returns {string} CSRF token
     */
    function getCSRFToken() {
        try {
            const stored = sessionStorage.getItem(SECURITY_CONFIG.csrfTokenName);
            if (stored) {
                const data = JSON.parse(stored);
                if (Date.now() < data.expiry) {
                    return data.token;
                }
            }
        } catch (e) {
            // sessionStorage not available
        }
        return refreshCSRFToken();
    }

    /**
     * Generate new CSRF token
     * @returns {string} New CSRF token
     */
    function refreshCSRFToken() {
        const token = generateToken();
        try {
            sessionStorage.setItem(SECURITY_CONFIG.csrfTokenName, JSON.stringify({
                token,
                expiry: Date.now() + SECURITY_CONFIG.csrfTokenExpiry
            }));
        } catch (e) {
            // sessionStorage not available
        }
        return token;
    }

    // ==========================================
    // URL Validation (Redirect Protection)
    // ==========================================

    /**
     * Validate if a URL is safe for redirect
     * @param {string} url - URL to validate
     * @returns {boolean} True if URL is safe
     */
    function isSafeRedirectUrl(url) {
        if (!url || typeof url !== 'string') return false;

        try {
            const parsed = new URL(url, window.location.origin);

            // Only allow same-origin redirects
            if (parsed.origin !== window.location.origin) {
                return false;
            }

            // Block dangerous protocols
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                return false;
            }

            return true;
        } catch (e) {
            return false;
        }
    }

    // ==========================================
    // Export to Global Scope
    // ==========================================

    window.NexTepSecurity = {
        // Rate limiting
        addSubmission: () => rateLimitStore.addSubmission(),
        isRateLimited: () => rateLimitStore.isRateLimited(),

        // XSS protection
        sanitizeInput,
        isInputSafe,
        sanitizeFormData,

        // Bot detection
        isHoneypotTriggered,
        recordFormOpen,
        isSubmissionTooFast,

        // CSRF protection
        getCSRFToken,
        refreshCSRFToken,

        // URL validation
        isSafeRedirectUrl,

        // Comprehensive check
        performSecurityChecks,

        // Config (for debugging)
        config: SECURITY_CONFIG
    };

    console.log('NexTep Security: Module loaded');

})();

