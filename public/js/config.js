// Frontend configuration
// This will use the backend URL from environment variable or default to localhost for development
const config = {
    API_URL: window.ENV_API_URL || 'http://localhost:3000'
};

// For production, set window.ENV_API_URL in your index.html or use a build process
