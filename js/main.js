/* ============================================
   DAN IVANOV BYGG & TAK - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initScrollEffects();
    initContactForm();
    initSmoothScroll();
    initScrollToTop();
    setActiveNavLink();
});

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!mobileToggle || !navMenu) return;

    mobileToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');

        // Animate hamburger to X
        const spans = mobileToggle.querySelectorAll('span');
        if (mobileToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');

            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');

            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

/* ============================================
   SCROLL EFFECTS
   ============================================ */
function initScrollEffects() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });
}

/* ============================================
   CONTACT FORM
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('.form-submit .btn');
        const formMessage = document.getElementById('form-message');

        // Get form data
        const formData = {
            name: form.querySelector('#name').value,
            email: form.querySelector('#email').value,
            phone: form.querySelector('#phone').value,
            location: form.querySelector('#location')?.value || '',
            projectType: form.querySelector('#project-type').value,
            description: form.querySelector('#description').value,
            wantSiteVisit: form.querySelector('#site-visit')?.checked || false
        };

        // Validate required fields
        if (!formData.name || !formData.email || !formData.phone || !formData.description) {
            showFormMessage(formMessage, 'Vennligst fyll ut alle påkrevde felt.', 'error');
            return;
        }

        // Validate email format
        if (!isValidEmail(formData.email)) {
            showFormMessage(formMessage, 'Vennligst oppgi en gyldig e-postadresse.', 'error');
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<span class="spinner"></span> Sender...';

        try {
            // Simulate API call (replace with actual Resend API integration)
            await simulateFormSubmission(formData);

            // Success
            showFormMessage(
                formMessage,
                'Takk for din henvendelse! Jeg vil kontakte deg så snart som mulig, vanligvis innen én arbeidsdag. Har du en akutt lekkasje? Ring meg direkte!',
                'success'
            );
            form.reset();

        } catch (error) {
            // Error
            showFormMessage(
                formMessage,
                'Beklager, noe gikk galt. Vennligst prøv igjen eller ring meg direkte.',
                'error'
            );
        } finally {
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = 'Send Henvendelse';
        }
    });
}

function showFormMessage(element, message, type) {
    if (!element) return;

    element.textContent = message;
    element.className = 'form-message ' + type;
    element.style.display = 'block';

    // Scroll to message
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Hide after 10 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 10000);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function simulateFormSubmission(formData) {
    // Simulate network delay
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // For demo purposes, always succeed
            // In production, this would send to Resend API
            console.log('Form data:', formData);
            resolve({ success: true });
        }, 1500);
    });
}

/* ============================================
   RESEND API INTEGRATION (Production)
   ============================================ */
/*
async function sendToResend(formData) {
    const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: 'nettside@danivanov-tak.no',
            to: 'post@danivanov-tak.no',
            subject: `Ny henvendelse: ${formData.projectType}`,
            html: `
                <h2>Ny henvendelse fra nettsiden</h2>
                <p><strong>Navn:</strong> ${formData.name}</p>
                <p><strong>E-post:</strong> ${formData.email}</p>
                <p><strong>Telefon:</strong> ${formData.phone}</p>
                <p><strong>Sted:</strong> ${formData.location || 'Ikke oppgitt'}</p>
                <p><strong>Prosjekttype:</strong> ${formData.projectType}</p>
                <p><strong>Ønsker befaring:</strong> ${formData.wantSiteVisit ? 'Ja' : 'Nei'}</p>
                <h3>Beskrivelse:</h3>
                <p>${formData.description}</p>
            `
        })
    });

    if (!response.ok) {
        throw new Error('Failed to send email');
    }

    return response.json();
}
*/

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   SCROLL TO TOP
   ============================================ */
function initScrollToTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ============================================
   ACTIVE NAV LINK
   ============================================ */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/* ============================================
   INTERSECTION OBSERVER FOR ANIMATIONS
   ============================================ */
function initAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation class
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));
}

/* ============================================
   LAZY LOADING IMAGES
   ============================================ */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

/* ============================================
   PHONE NUMBER CLICK TRACKING
   ============================================ */
function trackPhoneClicks() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Google Analytics tracking (if implemented)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'Contact',
                    'event_label': 'Phone Click',
                    'value': 1
                });
            }
            console.log('Phone click tracked');
        });
    });
}

/* ============================================
   UTILITIES
   ============================================ */
function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
