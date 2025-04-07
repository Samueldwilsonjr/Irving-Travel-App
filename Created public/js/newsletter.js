document.addEventListener('DOMContentLoaded', function() {
    // Initialize newsletter form submission
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmission);
    }
});

/**
 * Handle newsletter form submission
 * @param {Event} e - Submit event
 */
async function handleNewsletterSubmission(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('newsletter-email');
    const messageContainer = document.getElementById('newsletter-message');
    
    // Basic email validation
    if (!validateEmail(emailInput.value)) {
        displayNewsletterMessage('Please enter a valid email address.', 'danger');
        return;
    }
    
    try {
        // Show loading indicator
        displayNewsletterMessage('Subscribing...', 'info');
        
        // Send subscription request to server
        const response = await fetch('/api/newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: emailInput.value })
        });
        
        // Process the response
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Subscription failed');
        }
        
        // Display success message and reset form
        displayNewsletterMessage('Thank you for subscribing to our newsletter!', 'success');
        emailInput.value = '';
        
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        displayNewsletterMessage(error.message || 'Subscription failed. Please try again later.', 'danger');
    }
}

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - Whether the email is valid
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Display newsletter subscription message
 * @param {string} message - Message to display
 * @param {string} type - Message type (success, danger, info)
 */
function displayNewsletterMessage(message, type) {
    const messageContainer = document.getElementById('newsletter-message');
    
    messageContainer.innerHTML = `
        <div class="alert alert-${type}" role="alert">
            ${message}
        </div>
    `;
    
    messageContainer.style.display = 'block';
    
    // Hide success or info messages after 5 seconds
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 5000);
    }
}
