# Vercel Deployment Instructions

## Setting Up Environment Variable in Vercel

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your project: `cv-generator-ten-bice`
3. Go to **Settings** → **Environment Variables**
4. Add new environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-render-backend-url.onrender.com`
   - **Environment**: Production, Preview, Development (check all)
5. Click **Save**
6. Redeploy your application

## Setting Up Backend on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add Environment Variables:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   REDIRECT_URI=https://your-app.onrender.com/auth/google/callback
   BACKEND_URL=https://your-app.onrender.com
   FRONTEND_URL=https://cv-generator-ten-bice.vercel.app
   PORT=3000
   ```
5. Deploy

## Update Google OAuth

Add to Google Cloud Console:
- **Authorized JavaScript origins**: `https://cv-generator-ten-bice.vercel.app`
- **Authorized redirect URIs**: `https://your-render-app.onrender.com/auth/google/callback`

## How It Works

The frontend uses environment variables injected at build time:
- `%%VITE_API_URL%%` placeholder is replaced during Vercel build
- No hardcoded API URLs in the codebase
- Fallback to localhost for local development
