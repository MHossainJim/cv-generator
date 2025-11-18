const fs = require('fs');
const path = require('path');

// Get environment variable
const apiUrl = process.env.VITE_API_URL || 'http://localhost:3000';

// Files to process
const files = [
    'index.html',
    'form.html',
    'cv-template.html'
];

// Replace placeholder with actual environment variable
files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/%%VITE_API_URL%%/g, apiUrl);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Processed ${file} with API_URL: ${apiUrl}`);
    }
});

console.log('Environment variables injected successfully!');
