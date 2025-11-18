# Portfolio Generator with Google OAuth

A simple portfolio/CV generator web application that allows users to log in with their Google account, input their information, and generate a professional CV as a downloadable PDF.

## Features

- 🔐 Google OAuth 2.0 authentication
- 📝 Comprehensive form for portfolio information
- 🎨 Professional CV template
- 📄 PDF generation (via browser print)
- 🚀 Pure HTML, CSS, JavaScript frontend
- ⚡ Node.js backend (no frameworks, just core modules)

## Prerequisites

- Node.js (v14 or higher)
- Google Cloud Console account for OAuth credentials

## Setup Instructions

### 1. Install Dependencies

```powershell
cd d:\Jim
npm install
```

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Configure the OAuth consent screen:
   - Application name: Portfolio Generator
   - Authorized domains: localhost
6. Create OAuth 2.0 credentials:
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:3000/auth/google/callback`
7. Copy the **Client ID** and **Client Secret**

### 3. Update Configuration

Open `config.json` and replace the placeholder values:

```json
{
  "google": {
    "clientId": "YOUR_GOOGLE_CLIENT_ID_HERE",
    "clientSecret": "YOUR_GOOGLE_CLIENT_SECRET_HERE",
    "redirectUri": "http://localhost:3000/auth/google/callback"
  },
  "port": 3000
}
```

### 4. Run the Application

```powershell
npm start
```

The application will be available at: `http://localhost:3000`

## Usage

1. **Login**: Click "Sign in with Google" on the home page
2. **Authorize**: Grant permissions to the application
3. **Fill Form**: Complete the portfolio form with your information:
   - Personal Information
   - Professional Summary
   - Education
   - Work Experience
   - Skills
   - Projects
   - Certifications
4. **Generate**: Click "Generate Portfolio" to create your CV
5. **Download**: Click "Download PDF" to save your CV (uses browser print dialog)

## Project Structure

```
d:\Jim\
├── server.js              # Node.js server (pure http module)
├── package.json           # Dependencies
├── config.json           # Configuration (Google OAuth credentials)
├── index.html            # Login page
├── form.html             # Portfolio form page
├── cv-template.html      # CV template page
├── public/
│   ├── css/
│   │   └── style.css     # All styles
│   └── js/
│       ├── login.js      # Login page logic
│       ├── form.js       # Form page logic
│       └── cv.js         # CV generation logic
└── README.md
```

## Technologies Used

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript (no frameworks)

### Backend
- Node.js (core modules only)
  - `http` - HTTP server
  - `fs` - File system operations
  - `path` - Path utilities
  - `url` - URL parsing
  - `querystring` - Query string parsing
- `google-auth-library` - Google OAuth authentication (only external dependency)

## How It Works

1. **Authentication Flow**:
   - User clicks "Sign in with Google"
   - Server generates OAuth URL and redirects to Google
   - User authorizes the application
   - Google redirects back with authorization code
   - Server exchanges code for tokens and creates a session
   - User is redirected to the form page

2. **Data Collection**:
   - User fills out the portfolio form
   - Data is submitted to the server
   - Server stores data in session (in-memory)

3. **CV Generation**:
   - User clicks "Generate Portfolio"
   - CV template page loads portfolio data from server
   - Data is dynamically inserted into HTML template
   - User can download as PDF using browser's print function

## Security Notes

⚠️ **Important**: This is a simple implementation for demonstration purposes. For production use:

- Replace in-memory session storage with a proper session management system
- Add HTTPS/SSL encryption
- Implement CSRF protection
- Add rate limiting
- Secure session cookies
- Add proper error handling and logging
- Implement data validation and sanitization

## Customization

### Change Port

Edit `config.json` and modify the `port` value:

```json
{
  "port": 8080
}
```

### Customize CV Template

Edit `cv-template.html` and `public/css/style.css` to change the CV design.

## Troubleshooting

### "Authentication failed"
- Verify your Google OAuth credentials in `config.json`
- Check that the redirect URI matches exactly: `http://localhost:3000/auth/google/callback`

### "Not authenticated" errors
- Session may have expired
- Try logging in again

### CSS/JS not loading
- Ensure the server is running
- Check browser console for errors
- Verify file paths are correct

## License

ISC

## Author

Portfolio Generator - Simple CV creation with Google OAuth
