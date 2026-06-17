/* =============================================
   Prime Touch Spa — Shared JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', async function() {

    // ===== 1. LOAD COMPONENTS (Header & Footer) =====
    try {
        const [headerHtml, footerHtml] = await Promise.all([
            fetch('components/header.html').then(r => {
                if (!r.ok) throw new Error('Header not found');
                return r.text();
            }),
            fetch('components/footer.html').then(r => {
                if (!r.ok) throw new Error('Footer not found');
                return r.text();
            })
        ]);

        document.getElementById('header').innerHTML = headerHtml;
        document.getElementById('footer').innerHTML = footerHtml;

        // After components load, init features
        initNav();
        initActiveLink();
        initHeaderScroll();
        initBackToTop();
    } catch (e) {
        console.warn('Components loader:', e.message);
    }

    // ===== 2. INIT SCROLL REVEAL =====
    initScrollReveal();

    // ===== 3. INIT SMOOTH SCROLL =====
    initSmoothScroll();

    // ===== 4. INIT GALLERY FILTERS =====
    initGalleryFilters();

    // ===== 5. INIT CONTACT FORM =====
    initContactForm();

    // ===== 6. INIT BOOKING FORM =====
    initBookingForm();

    // ===== 7. INIT GOOGLE ADS GOALS =====
    initGoogleAdsGoals();
});

// ===== NAVIGATION =====
function initNav() {
    const toggle = document.getElementById('navToggle');
    const close = document.getElementById('navClose');
    const nav = document.getElementById('headerNav');

    if (!toggle || !nav) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.id = 'navOverlay';
    document.body.appendChild(overlay);

    const overlayEl = document.getElementById('navOverlay');

    function openNav() {
        nav.classList.add('active');
        overlayEl.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        nav.classList.remove('active');
        overlayEl.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', openNav);
    if (close) close.addEventListener('click', closeNav);
    overlayEl.addEventListener('click', closeNav);

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeNav();
    });

    // Close on nav link click (mobile)
    nav.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', closeNav);
    });
}

// ===== ACTIVE NAV LINK =====
function initActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(function(link) {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === 'index.html' && (href === '/' || href === '/index.html'))) {
            link.classList.add('active');
        }
    });
}

// ===== HEADER SCROLL EFFECT =====
function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (window.pageYOffset > 80) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ===== BACK TO TOP =====
function initBackToTop() {
    // Create button
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.id = 'backToTop';
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
    btn.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(btn);

    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (window.pageYOffset > 400) {
                    btn.classList.add('visible');
                } else {
                    btn.classList.remove('visible');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    if (revealElements.length === 0) return;

    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function(el) {
        revealObserver.observe(el);
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== GALLERY FILTERS =====
function initGalleryFilters() {
    const filters = document.querySelectorAll('.gallery-filter');
    if (filters.length === 0) return;

    const items = document.querySelectorAll('.gallery-item');

    filters.forEach(function(filter) {
        filter.addEventListener('click', function() {
            // Update active filter
            filters.forEach(function(f) { f.classList.remove('active'); });
            this.classList.add('active');

            const category = this.getAttribute('data-filter');

            items.forEach(function(item) {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    setTimeout(function() {
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '&#9989; Message Sent!';
        submitBtn.disabled = true;

        // Build mailto link
        const name = form.querySelector('#name')?.value || '';
        const email = form.querySelector('#email')?.value || '';
        const phone = form.querySelector('#phone')?.value || '';
        const message = form.querySelector('#message')?.value || '';

        const subject = encodeURIComponent('New Inquiry from ' + name);
        const body = encodeURIComponent(
            'Name: ' + name + '\n' +
            'Email: ' + email + '\n' +
            'Phone: ' + phone + '\n\n' +
            'Message:\n' + message
        );

        // Open mailto as fallback
        window.location.href = 'mailto:info@primetouchspa.shop?subject=' + subject + '&body=' + body;

        // Reset after 3 seconds
        setTimeout(function() {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            form.reset();
        }, 3000);

        // Also open WhatsApp as additional option
        setTimeout(function() {
            const waText = encodeURIComponent(
                'Hi Prime Touch Spa! I would like to inquire about your services.\n\n' +
                'Name: ' + name + '\n' +
                'Phone: ' + phone
            );
            window.open('https://wa.me/923469153944?text=' + waText, '_blank');
        }, 500);
    });
}

// ===== GOOGLE ADS GOALS TRACKING =====
function initGoogleAdsGoals() {
    // Track phone call clicks
    const callLinks = document.querySelectorAll('a[href^="tel:"]');
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me/"]');

    function trackConversion(sendTo) {
        if (typeof window.gtag !== 'function') return;
        window.gtag('event', 'conversion', {
            send_to: sendTo,
            value: 1.0,
            currency: 'PKR'
        });
    }

    callLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            trackConversion('AW-18223468176/W_LPCJWk7r8cEJCd0PFD');
        });
    });

    whatsappLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            trackConversion('AW-18223468176/o7h5CMjI8MAcEJCd0PFD');
        });
    });
}

// ===== BOOKING FORM =====
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('.booking-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '&#9989; Request Sent!';
        submitBtn.disabled = true;

        const name = form.querySelector('#book-name')?.value || '';
        const phone = form.querySelector('#book-phone')?.value || '';
        const service = form.querySelector('input[name="service"]:checked')?.value || 'Not specified';
        const date = form.querySelector('#book-date')?.value || '';
        const time = form.querySelector('#book-time')?.value || '';
        const notes = form.querySelector('#book-notes')?.value || '';

        // Open WhatsApp with booking details
        const waText = encodeURIComponent(
            'Hi Prime Touch Spa! I would like to book an appointment.\n\n' +
            'Name: ' + name + '\n' +
            'Phone: ' + phone + '\n' +
            'Service: ' + service + '\n' +
            'Date: ' + date + '\n' +
            'Time: ' + time + '\n' +
            'Notes: ' + notes
        );

        window.open('https://wa.me/923469153944?text=' + waText, '_blank');

        // Reset after 3 seconds
        setTimeout(function() {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            form.reset();
        }, 3000);
    });
}
