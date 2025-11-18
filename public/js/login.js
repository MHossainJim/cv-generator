// Login page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('google-login-btn');
    const errorMessage = document.getElementById('error-message');

    loginBtn.addEventListener('click', async () => {
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
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
});
