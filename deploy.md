
# Deployment Guide for Vercel

## Quick Start

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Deploy:**
   - Click "Deploy"
   - Your app will be live at `your-project-name.vercel.app`

## Features in Production

✅ **Working Features:**
- Full chess gameplay
- JavaScript AI opponent (all difficulty levels)
- Hint system with JavaScript analysis
- Game modes (Classic, Speed, Puzzle)
- Statistics tracking
- Responsive design
- Dark/light theme
- Multi-language support
- Secure user authentication via Clerk
- PlayFab integration for backend services (requires environment variables)

❌ **Not Available:**
- Python chess engine (Hobby tier limitation)
- Advanced position analysis from Python backend

## Custom Domain Setup

1. Go to your Vercel project dashboard
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Environment Variables

To deploy the application with full functionality, you must set the following environment variables in your Vercel project settings:

-   `CLERK_SECRET_KEY`: Your secret key from the Clerk dashboard. You can find this under **API Keys -> Advanced -> Toggle "Show secret key"**. It will start with `sk_live_` or `sk_test_`.
-   `PLAYFAB_TITLE_ID`: Your Title ID from the PlayFab Game Manager dashboard.
-   `PLAYFAB_SECRET_KEY`: Your secret key from the PlayFab Game Manager dashboard. Go to **Settings -> Secret Keys**.

These variables are essential for the backend orchestrator to securely connect Clerk authentication with PlayFab services. Without them, multiplayer features will not work.

## Monitoring

Vercel provides built-in analytics and performance monitoring in the dashboard.
