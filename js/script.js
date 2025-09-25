// Portfolio JavaScript - Enhanced Version with Comments

// Wait for the DOM to fully load before running scripts
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio loaded successfully!');
    init(); // Initialize all features
});

// Main initialization function
function init() {
    setupSmoothScrolling();      // Enable smooth scrolling for navigation
    setupScrollAnimations();     // Animate sections on scroll
    setupSkillAnimations();      // Prepare skill bar animations
    setupThemeToggle();          // Enable dark/light theme toggle
    addInteractiveFeatures();    // Add interactive UI features
    // setupContactForm();       // Uncomment if you add a contact form
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor behavior
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate scroll position accounting for header height
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                updateActiveNavLink(this); // Highlight active nav link
            }
        });
    });
    
    // Update active navigation link on scroll (debounced for performance)
    window.addEventListener('scroll', debounce(updateActiveNavOnScroll, 10));
}

// Highlight the currently active navigation link
function updateActiveNavLink(activeLink) {
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Update active navigation link based on scroll position
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const headerHeight = document.querySelector('header').offsetHeight;
    const scrollPos = window.scrollY + headerHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        const navLink = document.querySelector(`nav a[href="#${section.id}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
            });
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

// Animate sections when they enter the viewport
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in'); // Add animation class
                
                // Animate skill bars when skills section is visible
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }
                
                // Trigger typing effect when about section is visible
                if (entry.target.id === 'about') {
                    triggerTypingEffect();
                }
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Prepare skill bar animations (triggered when visible)
function setupSkillAnimations() {
    // Expose animateSkillBars globally for use in IntersectionObserver
    window.animateSkillBars = function() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.classList.add('animate'); // Animate each bar with delay
            }, index * 200);
        });
    };
}

// Theme toggle (dark/light mode) with localStorage persistence
function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const body = document.body;

    // Load saved theme preference from localStorage
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark');
        toggle.checked = true;
    }

    // Listen for toggle changes
    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            body.classList.add('dark');
            localStorage.setItem('portfolio-theme', 'dark');
        } else {
            body.classList.remove('dark');
            localStorage.setItem('portfolio-theme', 'light');
        }
    });
}

// Add interactive UI features (hover effects, scroll-to-top, etc.)
function addInteractiveFeatures() {
    // Enhanced hover effects for cards
    const cards = document.querySelectorAll('.project-card, .hobby-card, .achievement-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'var(--shadow)';
        });
    });
    
    // Scroll to top when header title is clicked
    const headerTitle = document.querySelector('header h1');
    if (headerTitle) {
        headerTitle.addEventListener('click', scrollToTop);
    }
}

// Typing effect for tagline in the about section
function triggerTypingEffect() {
    const tagline = document.querySelector('.tagline');
    if (tagline && !tagline.classList.contains('typed')) {
        tagline.classList.add('typed');
        const originalText = tagline.textContent;
        tagline.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                tagline.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50); // Type each character with delay
            }
        };
        
        setTimeout(typeWriter, 500); // Start typing after short delay
    }
}

// Smooth scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Debounce function for performance optimization
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

// Contact form handling (if you add a contact form later)
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

// Handle contact form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // Basic validation
    if (!name || !email || !message) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    // Add further form handling logic here
}