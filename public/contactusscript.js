document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();

    // Basic validation
    if (!name || name.length < 2) {
        alert('Please enter a valid name (at least 2 characters)');
        return;
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }

    if (!subject) {
        alert('Please select a subject');
        return;
    }

    if (!message || message.length < 10) {
        alert('Message must be at least 10 characters long');
        return;
    }

    // Simulate form submission
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = '📤 Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.textContent = '✅ Message Sent!';
        submitBtn.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';

        setTimeout(() => {
            alert(`Thank you ${name}! Your message has been sent successfully. We'll get back to you within 24 hours.`);

            // Reset form
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.style.background = 'linear-gradient(45deg, #6c7ae0, #a8edea)';
            submitBtn.disabled = false;
        }, 1500);
    }, 2000);
});

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// FAQ Toggle
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function () {
        const answer = this.nextElementSibling;
        const isActive = answer.classList.contains('active');

        // Close all other FAQ answers
        document.querySelectorAll('.faq-answer').forEach(ans => {
            ans.classList.remove('active');
        });

        // Toggle current answer
        if (!isActive) {
            answer.classList.add('active');
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Input focus animations
document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
    input.addEventListener('focus', function () {
        this.parentNode.classList.add('focused');
    });

    input.addEventListener('blur', function () {
        if (this.value === '') {
            this.parentNode.classList.remove('focused');
        }
    });
});

// Particle animation enhancement
function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.width = (Math.random() * 5 + 2) + 'px';
    particle.style.height = particle.style.width;
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';

    document.querySelector('.particles').appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 8000);
}

// Create additional particles periodically
setInterval(createParticle, 3000);

// Form field validation in real-time
document.getElementById('name').addEventListener('input', function () {
    const value = this.value.trim();
    if (value.length >= 2) {
        this.style.borderColor = '#27ae60';
    } else if (value.length > 0) {
        this.style.borderColor = '#e74c3c';
    } else {
        this.style.borderColor = '#ecf0f1';
    }
});

document.getElementById('email').addEventListener('input', function () {
    const value = this.value.trim();
    if (validateEmail(value)) {
        this.style.borderColor = '#27ae60';
    } else if (value.length > 0) {
        this.style.borderColor = '#e74c3c';
    } else {
        this.style.borderColor = '#ecf0f1';
    }
});

document.getElementById('message').addEventListener('input', function () {
    const value = this.value.trim();
    if (value.length >= 10) {
        this.style.borderColor = '#27ae60';
    } else if (value.length > 0) {
        this.style.borderColor = '#e74c3c';
    } else {
        this.style.borderColor = '#ecf0f1';
    }
});

// Phone number formatting
document.getElementById('phone').addEventListener('input', function () {
    let value = this.value.replace(/\D/g, '');
    if (value.length >= 10) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    this.value = value;
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.contact-section, .map-section, .faq-section').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Social links hover effects
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-5px) scale(1.1) rotate(5deg)';
    });

    icon.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
    });
});

// Contact info items stagger animation
document.querySelectorAll('.info-item').forEach((item, index) => {
    item.style.animationDelay = `${index * 0.2}s`;
    item.style.animation = 'slideUp 0.6s ease-out both';
});

// Form character counter for message
const messageField = document.getElementById('message');
const charCounter = document.createElement('div');
charCounter.style.cssText = 'font-size: 12px; color: #7f8c8d; text-align: right; margin-top: 5px;';
messageField.parentNode.appendChild(charCounter);

messageField.addEventListener('input', function () {
    const length = this.value.length;
    charCounter.textContent = `${length} characters`;

    if (length >= 10) {
        charCounter.style.color = '#27ae60';
    } else {
        charCounter.style.color = '#e74c3c';
    }
});

// Loading screen simulation
window.addEventListener('load', function () {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Header scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const header = document.querySelector('.header');

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }

    lastScrollTop = scrollTop;
});

// Add scroll transition to header
document.querySelector('.header').style.transition = 'transform 0.3s ease-in-out';

// Error handling for form submission
window.addEventListener('error', function (e) {
    console.error('JavaScript error:', e.error);
});

// Form data persistence (using variables instead of localStorage)
let formData = {};

function saveFormData() {
    formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
}

function loadFormData() {
    if (Object.keys(formData).length > 0) {
        document.getElementById('name').value = formData.name || '';
        document.getElementById('email').value = formData.email || '';
        document.getElementById('phone').value = formData.phone || '';
        document.getElementById('subject').value = formData.subject || '';
        document.getElementById('message').value = formData.message || '';
    }
}

// Save form data on input
document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea').forEach(field => {
    field.addEventListener('input', saveFormData);
});

// Load form data on page load
window.addEventListener('load', loadFormData);

// Enhanced form submission with better UX
function enhancedSubmitForm(formElement) {
    const submitBtn = formElement.querySelector('.submit-btn');
    const originalContent = submitBtn.innerHTML;

    // Add loading spinner
    submitBtn.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite;">⏳</span> Sending...';
    submitBtn.disabled = true;

    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            submitBtn.innerHTML = '✅ Sent Successfully!';
            submitBtn.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';

            setTimeout(() => {
                submitBtn.innerHTML = originalContent;
                submitBtn.style.background = 'linear-gradient(45deg, #6c7ae0, #a8edea)';
                submitBtn.disabled = false;
                resolve(true);
            }, 2000);
        }, 1500);
    });
}

// Add CSS for spinner animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

document.getElementById("contactForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
    };

    try {
        const response = await fetch("http://localhost:5000/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            document.getElementById("contactForm").reset();
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        alert("Failed to send message. Please try again.");
        console.error(error);
    }
});
