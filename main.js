// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav') && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
        }
    });
});

// Multi-step Form Handling
class MultiStepForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (!this.form) return;
        
        this.steps = this.form.querySelectorAll('.form-step');
        this.currentStep = 0;
        this.progressBar = document.querySelector('.progress');
        this.nextButtons = this.form.querySelectorAll('.btn-next');
        this.prevButtons = this.form.querySelectorAll('.btn-prev');
        
        this.init();
    }
    
    init() {
        this.showStep(this.currentStep);
        this.bindEvents();
    }
    
    bindEvents() {
        this.nextButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.validateStep()) {
                    this.currentStep++;
                    this.showStep(this.currentStep);
                }
            });
        });
        
        this.prevButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.currentStep--;
                this.showStep(this.currentStep);
            });
        });
    }
    
    showStep(step) {
        this.steps.forEach((stepElement, index) => {
            stepElement.classList.toggle('active', index === step);
        });
        
        if (this.progressBar) {
            const progress = ((step + 1) / this.steps.length) * 100;
            this.progressBar.style.width = `${progress}%`;
        }
    }
    
    validateStep() {
        const currentStepElement = this.steps[this.currentStep];
        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        
        for (let input of inputs) {
            if (!input.value.trim()) {
                this.showError(input, 'This field is required');
                return false;
            }
            
            if (input.type === 'email' && !this.isValidEmail(input.value)) {
                this.showError(input, 'Please enter a valid email address');
                return false;
            }
            
            if (input.type === 'tel' && !this.isValidPhone(input.value)) {
                this.showError(input, 'Please enter a valid phone number');
                return false;
            }
        }
        
        return true;
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    isValidPhone(phone) {
        return /^[\d\s\-+()]{10,}$/.test(phone);
    }
    
    showError(input, message) {
        const formGroup = input.closest('.form-group');
        let errorElement = formGroup.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = '#dc3545';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.style.borderColor = '#dc3545';
        
        input.addEventListener('input', () => {
            errorElement.remove();
            input.style.borderColor = '';
        }, { once: true });
    }
}

// Initialize multi-step form if it exists
new MultiStepForm('factFinderForm');

// Web3Forms Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('factFinderForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Collect form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Add your Web3Forms access key
            data.access_key = '4683c45f-d8a6-4c54-9b0c-353acc2853a7'; // Replace with your actual Web3Forms access key
            
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Show success message
                    showAlert('Thank you for your submission! We will contact you shortly.', 'success');
                    contactForm.reset();
                    
                    // Reset to step 1 if multi-step form
                    if (window.multiStepForm) {
                        window.multiStepForm.currentStep = 0;
                        window.multiStepForm.showStep(0);
                    }
                } else {
                    showAlert('There was an error submitting the form. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showAlert('There was an error submitting the form. Please try again.', 'error');
            } finally {
                // Reset button state
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
});

// Show alert messages
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '9999';
    alertDiv.style.padding = '1rem';
    alertDiv.style.borderRadius = '5px';
    alertDiv.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    alertDiv.style.color = type === 'success' ? '#155724' : '#721c24';
    alertDiv.style.border = type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

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

// Add current year to copyright
document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

// Form input validation on the fly
document.querySelectorAll('input[required], select[required]').forEach(input => {
    input.addEventListener('blur', function() {
        if (!this.value.trim()) {
            this.style.borderColor = '#dc3545';
        } else {
            this.style.borderColor = '';
        }
    });
    
    input.addEventListener('input', function() {
        this.style.borderColor = '';
    });
});

// Phone number formatting
document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        
        if (value.length > 6) {
            value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);
        } else if (value.length > 3) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        }
        
        this.value = value;
    });
});

// Cookie consent banner (optional)
function showCookieConsent() {
    if (!localStorage.getItem('cookieConsent')) {
        const banner = document.createElement('div');
        banner.className = 'cookie-consent';
        banner.style.position = 'fixed';
        banner.style.bottom = '20px';
        banner.style.left = '20px';
        banner.style.right = '20px';
        banner.style.backgroundColor = 'white';
        banner.style.padding = '1rem';
        banner.style.borderRadius = '5px';
        banner.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        banner.style.zIndex = '9998';
        banner.style.display = 'flex';
        banner.style.justifyContent = 'space-between';
        banner.style.alignItems = 'center';
        banner.style.gap = '1rem';
        
        banner.innerHTML = `
            <p style="margin: 0;">We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
            <button class="btn" style="white-space: nowrap;" onclick="acceptCookies()">Accept</button>
        `;
        
        document.body.appendChild(banner);
    }
}

// Accept cookies function
window.acceptCookies = function() {
    localStorage.setItem('cookieConsent', 'true');
    const banner = document.querySelector('.cookie-consent');
    if (banner) {
        banner.remove();
    }
};

// Uncomment to show cookie consent
// showCookieConsent();
