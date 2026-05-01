/**
 * Sushi Vibe Catering - Main JavaScript
 * Handles mobile navigation, gallery filtering, contact form, and interactive elements
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ========== MOBILE NAVIGATION TOGGLE ==========
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileToggle && mainNav) {
        // Create mobile menu container if needed
        const navUl = mainNav.querySelector('ul');
        
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            // Toggle mobile menu visibility
            if (mainNav.style.display === 'flex' || window.getComputedStyle(mainNav).display === 'flex') {
                mainNav.style.display = 'none';
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            } else {
                mainNav.style.display = 'flex';
                mainNav.style.flexDirection = 'column';
                mainNav.style.position = 'absolute';
                mainNav.style.top = '70px';
                mainNav.style.left = '0';
                mainNav.style.right = '0';
                mainNav.style.backgroundColor = 'white';
                mainNav.style.padding = '1.5rem';
                mainNav.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                mainNav.style.zIndex = '999';
                mainNav.style.borderRadius = '0 0 20px 20px';
                if (navUl) {
                    navUl.style.flexDirection = 'column';
                    navUl.style.gap = '1rem';
                    navUl.style.alignItems = 'center';
                }
                mobileToggle.innerHTML = '<i class="fas fa-times"></i>';
            }
        });
        
        // Close mobile menu when window is resized above mobile breakpoint
        window.addEventListener('resize', function() {
            if (window.innerWidth > 820) {
                mainNav.style.display = '';
                mainNav.style.position = '';
                mainNav.style.backgroundColor = '';
                mainNav.style.padding = '';
                mainNav.style.boxShadow = '';
                if (navUl) {
                    navUl.style.flexDirection = '';
                    navUl.style.gap = '';
                    navUl.style.alignItems = '';
                }
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            } else {
                // If menu was open and we resize, keep it as is, but if closed, ensure display is none
                if (mainNav.style.display !== 'flex') {
                    mainNav.style.display = 'none';
                }
            }
        });
        
        // Initialize: hide mobile menu by default on small screens
        if (window.innerWidth <= 820) {
            mainNav.style.display = 'none';
        }
    }

    // ========== GALLERY PAGE FILTERING ==========
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active button state
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                        item.style.opacity = '1';
                        // Add subtle animation
                        item.style.animation = 'fadeInUp 0.4s ease';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Add keyframe animation dynamically
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(15px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(styleSheet);

    // ========== CONTACT FORM HANDLER ==========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const message = document.getElementById('message')?.value.trim();
            const inquiryType = document.getElementById('inquiryType')?.value;
            
            // Simple validation
            if (!name || !email || !message) {
                showFormStatus('Please fill in all required fields (name, email, message).', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormStatus('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate successful submission
            showFormStatus(
                `Thank you ${name}! Your message has been sent. We'll get back to you within 24 hours. 🍣`,
                'success'
            );
            
            // Optionally reset form
            // contactForm.reset();
            
            // Log for debugging (in production, this would send to server)
            console.log('Contact Form Submission:', { name, email, inquiryType, message });
        });
    }
    
    function showFormStatus(message, type) {
        const statusDiv = document.getElementById('formStatus');
        if (statusDiv) {
            statusDiv.innerHTML = message;
            statusDiv.style.padding = '1rem';
            statusDiv.style.borderRadius = '16px';
            statusDiv.style.marginTop = '1rem';
            statusDiv.style.textAlign = 'center';
            
            if (type === 'success') {
                statusDiv.style.backgroundColor = '#e6f4ea';
                statusDiv.style.color = '#2b6e3c';
                statusDiv.style.border = '1px solid #2b6e3c30';
            } else {
                statusDiv.style.backgroundColor = '#feeceb';
                statusDiv.style.color = '#c53a1f';
                statusDiv.style.border = '1px solid #c53a1f30';
            }
            
            // Auto scroll to status
            statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Clear after 5 seconds for success
            if (type === 'success') {
                setTimeout(() => {
                    statusDiv.style.opacity = '0';
                    setTimeout(() => {
                        statusDiv.innerHTML = '';
                        statusDiv.style.opacity = '1';
                    }, 500);
                }, 5000);
            }
        }
    }

    // ========== ORDER PAGE PACKAGE SELECTION HIGHLIGHT ==========
    const pkgOptions = document.querySelectorAll('.pkg-option');
    if (pkgOptions.length > 0) {
        pkgOptions.forEach(option => {
            const radio = option.querySelector('input[type="radio"]');
            if (radio) {
                option.addEventListener('click', function(e) {
                    // Don't trigger if clicking directly on radio (it will bubble)
                    if (e.target.tagName !== 'INPUT') {
                        radio.checked = true;
                        // Trigger change event
                        const changeEvent = new Event('change', { bubbles: true });
                        radio.dispatchEvent(changeEvent);
                    }
                    // Update visual selection
                    pkgOptions.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                });
                
                // Initial check for selected radio
                if (radio.checked) {
                    option.classList.add('selected');
                }
                
                radio.addEventListener('change', function() {
                    pkgOptions.forEach(opt => opt.classList.remove('selected'));
                    if (this.checked) {
                        option.classList.add('selected');
                    }
                });
            }
        });
    }

    // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#' && targetId !== '' && targetId !== '#orderForm') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ========== ADD ACTIVE NAVIGATION CLASS BASED ON CURRENT PAGE ==========
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        } else if (currentPage.includes('packages') && linkHref === 'packages.html') {
            link.classList.add('active');
        } else if (currentPage.includes('about') && linkHref === 'about.html') {
            link.classList.add('active');
        } else if (currentPage.includes('gallery') && linkHref === 'gallery.html') {
            link.classList.add('active');
        } else if (currentPage.includes('contact') && linkHref === 'contact.html') {
            link.classList.add('active');
        } else if (currentPage.includes('order') && linkHref === 'order.html') {
            link.classList.add('active');
        }
    });

    // ========== LAZY LOADING FOR GALLERY IMAGES ==========
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('.gallery-item img, .teaser-item');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.tagName === 'IMG') {
                        const src = img.getAttribute('src');
                        if (src && img.src !== src) {
                            img.src = src;
                        }
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            if (img.tagName === 'IMG' && !img.complete) {
                imageObserver.observe(img);
            } else if (img.classList.contains('teaser-item')) {
                // Background images don't need lazy loading via JS, but we can observe
                imageObserver.observe(img);
            }
        });
    }

    // ========== TOOLTIP / NOTIFICATION FOR PRE-ORDER BUTTONS ==========
    const preorderBtns = document.querySelectorAll('.btn-order-now, .order-cta');
    preorderBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Just add a tiny ripple effect or tracking
            console.log('Pre-order button clicked:', this.textContent);
        });
    });

    // ========== DATE INPUT MINIMUM (24h advance notice) ==========
    const dateInput = document.getElementById('eventDate');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        dateInput.min = `${yyyy}-${mm}-${dd}`;
    }

    // ========== SIMPLE NEWSLETTER SUBSCRIBE (contact page checkbox feedback) ==========
    const newsletterCheckbox = document.getElementById('newsletter');
    if (newsletterCheckbox) {
        newsletterCheckbox.addEventListener('change', function() {
            if (this.checked) {
                console.log('Newsletter subscription opted-in');
                // Optional: show subtle tooltip
            }
        });
    }

    // ========== ANIMATE ON SCROLL (simple fade-in) ==========
    const fadeElements = document.querySelectorAll('.preview-card, .package-card-full, .info-card, .gallery-item');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        fadeObserver.observe(el);
    });

    // Small console greeting (fun touch)
    console.log('🍣 Sushi Vibe Catering — Fresh sushi, delivered with joy!');
});
