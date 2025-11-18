// Login page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Get all login buttons
    const navLoginBtn = document.getElementById('nav-login-btn');
    const heroCtaBtn = document.getElementById('hero-cta-btn');
    const footerCtaBtn = document.getElementById('footer-cta-btn');
    const errorMessage = document.getElementById('error-message');

    // Handle login for all buttons
    const handleLogin = async () => {
        try {
            // Get Google OAuth URL from server
            const response = await fetch(`${config.API_URL}/auth/google/url`);
            const data = await response.json();
            
            if (data.url) {
                // Redirect to Google OAuth
                window.location.href = data.url;
            } else {
                showError('Failed to get authentication URL');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Failed to initiate login. Please try again.');
        }
    };

    // Add event listeners to all buttons
    if (navLoginBtn) {
        navLoginBtn.addEventListener('click', handleLogin);
    }
    
    if (heroCtaBtn) {
        heroCtaBtn.addEventListener('click', handleLogin);
    }
    
    if (footerCtaBtn) {
        footerCtaBtn.addEventListener('click', handleLogin);
    }

    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
        }
    }
});
