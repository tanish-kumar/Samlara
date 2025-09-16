// ========================================
// SAMLARA ABOUT PAGE - COMPLETE JAVASCRIPT
// ========================================

// 1. SMOOTH SCROLL ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with animate-on-scroll class
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// 2. ANIMATED COUNTER FOR STATISTICS
// ========================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const numericTarget = parseInt(target.replace(/[^\d]/g, ''));
        
        if (numericTarget) {
            let count = 0;
            const increment = numericTarget / 50;
            const suffix = target.replace(/[\d,]/g, '');
            
            const timer = setInterval(() => {
                count += increment;
                if (count >= numericTarget) {
                    counter.textContent = numericTarget.toLocaleString() + suffix;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(count).toLocaleString() + suffix;
                }
            }, 40);
        }
    });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// 3. REVIEW CARDS HOVER EFFECTS
// ========================================
document.querySelectorAll('.review-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(-5px) scale(1)';
    });
});

// 4. SOCIAL MEDIA INTERACTIONS
// ========================================
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255,255,255,0.6);
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
        
        // Get platform name and simulate redirect
        const platform = this.classList[1];
        console.log(`Redirecting to ${platform}...`);
        
        // Replace with actual social media URLs
        const socialUrls = {
            'facebook': 'https://facebook.com/samlara',
            'instagram': 'https://instagram.com/samlara',
            'twitter': 'https://twitter.com/samlara',
            'youtube': 'https://youtube.com/samlara',
            'linkedin': 'https://linkedin.com/company/samlara'
        };
        
        // Uncomment to enable actual redirects
        // if (socialUrls[platform]) {
        //     window.open(socialUrls[platform], '_blank');
        // }
    });
});

// 5. DYNAMIC RIPPLE ANIMATION CSS
// ========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% {
            width: 20px;
            height: 20px;
            opacity: 1;
        }
        100% {
            width: 80px;
            height: 80px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 6. FOUNDER CARD INTERACTIONS
// ========================================
document.querySelectorAll('.founder-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        // Add extra glow effect
        this.style.boxShadow = '0 25px 50px rgba(108, 122, 224, 0.3)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
    });
});

// 7. NAVIGATION SMOOTH SCROLLING
// ========================================
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 8. PARTICLE ANIMATION CONTROLLER
// ========================================
function createFloatingParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
        position: absolute;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        width: ${Math.random() * 6 + 2}px;
        height: ${Math.random() * 6 + 2}px;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: float ${Math.random() * 4 + 4}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
        pointer-events: none;
    `;
    
    document.querySelector('.particles').appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
        particle.remove();
    }, 10000);
}

// Add new particles periodically
setInterval(createFloatingParticle, 3000);

// 9. SCROLL PROGRESS INDICATOR
// ========================================
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #6c7ae0, #a8edea);
        z-index: 1000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize scroll progress on load
document.addEventListener('DOMContentLoaded', createScrollProgress);

// 10. DYNAMIC TEXT TYPING EFFECT
// ========================================
function typeWriterEffect(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Apply typing effect to hero title when page loads
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriterEffect(heroTitle, originalText, 80);
    }
});

// 11. IMAGE LAZY LOADING
// ========================================
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

// Observe all lazy images
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// 12. FORM VALIDATION (if contact form exists)
// ========================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function handleFormSubmit(formElement) {
    formElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const messageInput = this.querySelector('textarea');
        
        if (emailInput && !validateEmail(emailInput.value)) {
            alert('Please enter a valid email address');
            return;
        }
        
        if (messageInput && messageInput.value.length < 10) {
            alert('Message must be at least 10 characters long');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent!';
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                this.reset();
            }, 2000);
        }, 1500);
    });
}

// 13. MOBILE MENU TOGGLE (if mobile menu exists)
// ========================================
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }
}

// 14. PERFORMANCE MONITORING
// ========================================
function monitorPerformance() {
    // Log page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    });
    
    // Monitor scroll performance
    let ticking = false;
    
    function updateScrollElements() {
        // Update scroll-dependent elements here
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollElements);
            ticking = true;
        }
    });
}

// 15. INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Samlara About Page Initialized');
    
    // Initialize all features
    initMobileMenu();
    monitorPerformance();
    
    // Add any contact forms
    const contactForms = document.querySelectorAll('form');
    contactForms.forEach(form => handleFormSubmit(form));
    
    // Add loading animation completion
    document.body.classList.add('loaded');
    
    console.log('All animations and interactions ready!');
});

// 16. UTILITY FUNCTIONS
// ========================================
const Utils = {
    // Debounce function for performance
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },
    
    // Smooth animation helper
    animate: function(element, property, start, end, duration, callback) {
        let startTime = null;
        
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const value = start + (end - start) * progress;
            
            element.style[property] = value + (property.includes('opacity') ? '' : 'px');
            
            if (progress < 1) {
                requestAnimationFrame(step);
            } else if (callback) {
                callback();
            }
        }
        
        requestAnimationFrame(step);
    },
    
    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};
// Export utils for global use
window.SamlaraUtils = Utils;