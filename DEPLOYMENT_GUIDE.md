# Deployment Guide

## Overview
This application is split into two parts:
- **Frontend**: Deployed on Vercel (HTML, CSS, JavaScript)
- **Backend**: Deployed on Render (Node.js API server)

---

## 🚀 Backend Deployment (Render)

### Step 1: Prepare for Deployment

1. Push your code to GitHub
2. Make sure `server.js` and `package.json` are in the root directory

### Step 2: Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `portfolio-generator-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

### Step 3: Set Environment Variables

In Render dashboard, go to **Environment** tab and add:

```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
REDIRECT_URI=https://your-render-app.onrender.com/auth/google/callback
BACKEND_URL=https://your-render-app.onrender.com
FRONTEND_URL=https://your-vercel-app.vercel.app
PORT=3000
```

### Step 4: Update Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   ```
   https://your-render-app.onrender.com/auth/google/callback
   ```
5. Add to **Authorized JavaScript origins**:
   ```
   https://your-vercel-app.vercel.app
   ```

### Step 5: Deploy

Click **Create Web Service** and wait for deployment to complete.

Your backend API will be available at: `https://your-render-app.onrender.com`

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Update Frontend Configuration

Before deploying, you need to set the backend API URL in your frontend.

**Option A: Using a config script (Recommended)**

Create a new file `public/js/env.js`:

```javascript
window.ENV_API_URL = 'https://your-render-app.onrender.com';
```

Then update your HTML files to include this script BEFORE config.js:

```html
<script src="/public/js/env.js"></script>
<script src="/public/js/config.js"></script>
```

**Option B: Modify config.js directly**

Edit `public/js/config.js`:

```javascript
const config = {
    API_URL: 'https://your-render-app.onrender.com'
};
```

### Step 2: Deploy on Vercel

#### Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```powershell
npm install -g vercel
```

2. Login to Vercel:
```powershell
vercel login
```

3. Deploy:
```powershell
vercel
```

4. For production deployment:
```powershell
vercel --prod
```

#### Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
5. Click **Deploy**

### Step 3: Update Frontend URL in Render

Once deployed, update the `FRONTEND_URL` environment variable in Render with your actual Vercel URL:

```
FRONTEND_URL=https://your-actual-vercel-url.vercel.app
```

Then redeploy your Render backend.

---

## 📝 Files for Different Deployments

### For Vercel (Frontend):
- `index.html`
- `form.html`
- `cv-template.html`
- `public/` directory
- `vercel.json`

### For Render (Backend):
- `server.js`
- `package.json`
- Environment variables (no config.json needed)

---

## 🧪 Testing the Deployment

1. Visit your Vercel URL: `https://your-vercel-app.vercel.app`
2. Click "Sign in with Google"
3. You should be redirected to Google for authentication
4. After authentication, you should be redirected back to the form page
5. Fill out the form and generate your CV

---

## 🐛 Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in Render matches your exact Vercel URL
- Check that Google OAuth redirect URIs are correctly configured

### "NOT_FOUND" Error on Vercel
- This happens when Vercel tries to serve backend routes
- Make sure you're not deploying `server.js` to Vercel
- The backend should only be on Render

### Authentication Fails
- Verify Google OAuth credentials in Render environment variables
- Check that redirect URI matches: `https://your-render-app.onrender.com/auth/google/callback`
- Ensure your Vercel URL is added to Google OAuth authorized origins

### Session Issues
- Cookies may not work across different domains
- The app uses query parameters for session management as a fallback

---

## 🔒 Security Notes

For production:
- Use proper session management (Redis, MongoDB)
- Enable HTTPS (both Vercel and Render provide this by default)
- Add rate limiting
- Implement CSRF protection
- Never commit `.env` or `config.json` with real credentials

---

## 📦 Quick Deployment Checklist

### Backend (Render):
- [ ] Push code to GitHub
- [ ] Create new Web Service on Render
- [ ] Add environment variables
- [ ] Update Google OAuth redirect URI
- [ ] Deploy and get backend URL

### Frontend (Vercel):
- [ ] Update `public/js/config.js` with backend URL
- [ ] Deploy to Vercel
- [ ] Get frontend URL
- [ ] Update `FRONTEND_URL` in Render
- [ ] Update Google OAuth authorized origins

### Testing:
- [ ] Test login flow
- [ ] Test form submission
- [ ] Test CV generation
- [ ] Test PDF download

---

## 🆘 Need Help?

Common issues:
1. **404 on Vercel**: You're trying to access backend routes - use your Render URL for API calls
2. **CORS errors**: Update FRONTEND_URL in Render to match your Vercel URL exactly
3. **Auth fails**: Double-check Google OAuth configuration with both URLs
