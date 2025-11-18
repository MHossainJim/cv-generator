// Production environment configuration
// This will be replaced by environment variable during Vercel build
// For local development, it uses localhost
window.ENV_API_URL = typeof process !== 'undefined' && process.env.VITE_API_URL 
    ? process.env.VITE_API_URL 
    : (window.location.hostname === 'localhost' 
        ? 'http://localhost:3000' 
        : 'https://cv-generator-t8cp.onrender.com');
