
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

❌ **Not Available:**
- Python chess engine (Hobby tier limitation)
- Advanced position analysis from Python backend

## Custom Domain Setup

1. Go to your Vercel project dashboard
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Environment Variables

No environment variables are required for the basic deployment.

## Monitoring

Vercel provides built-in analytics and performance monitoring in the dashboard.
