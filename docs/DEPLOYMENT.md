
# Deployment Guide

This guide covers deploying the Chess Application across different platforms and environments.

## Environment Variables

Before deploying, ensure these environment variables are configured:

### Required Variables
- `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Optional Variables
- `VITE_PYTHON_ENGINE_URL`: URL for the Python chess engine (default: http://127.0.0.1:8000)
- `VITE_SENTRY_DSN`: Sentry DSN for error tracking
- `VITE_ENABLE_PYTHON_ENGINE`: Enable/disable Python engine (default: true)
- `VITE_ENABLE_PLAYFAB`: Enable/disable PlayFab integration (default: true)
- `VITE_ENABLE_MULTIPLAYER`: Enable/disable multiplayer features (default: true)

## Platform-Specific Deployments

### Vercel (Recommended for Web App)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

```bash
npm run build
npx vercel --prod
```

### Railway (Full Stack with Python Engine)

1. Create a new Railway project
2. Connect your GitHub repository
3. Configure services in `railway.toml`
4. Set environment variables in Railway dashboard

### Docker Deployment

#### Development
```bash
docker-compose up -d
```

#### Production
```bash
# Build and run web app
docker build -f Dockerfile.web -t chess-app-web .
docker run -p 8080:8080 chess-app-web

# Build and run Python engine
docker build -f python_engine/Dockerfile -t chess-app-python .
docker run -p 8000:8000 chess-app-python
```

### Local Development

1. Copy environment template:
```bash
cp .env.example .env
```

2. Fill in your environment variables

3. Install dependencies:
```bash
npm install
cd python_engine && pip install -r requirements.txt
```

4. Start development servers:
```bash
# Terminal 1: Web app
npm run dev

# Terminal 2: Python engine (optional)
cd python_engine && python app.py
```

## Environment-Specific Configurations

### Development
- Python engine runs locally
- Debug logging enabled
- Environment validation shown

### Production
- Python engine can be disabled or run on separate service
- Optimized builds
- Error tracking with Sentry

### Testing
- Mock services for external dependencies
- Isolated test environment
- Feature flags disabled

## Troubleshooting

### Common Issues

1. **Python Engine Not Available**
   - Check `VITE_PYTHON_ENGINE_URL` is correct
   - Verify Python engine is running and accessible
   - App will fallback to JavaScript AI automatically

2. **Authentication Issues**
   - Verify Clerk publishable key is set
   - Check Supabase URL and anon key
   - Ensure domain is configured in Clerk dashboard

3. **Build Failures**
   - Check all required environment variables are set
   - Verify TypeScript types are correct
   - Review build logs for specific errors

### Health Checks

The application includes built-in health checks:
- Environment validation on startup
- Service availability checks
- Graceful degradation when services are unavailable

## Security Considerations

1. Never commit `.env` files to version control
2. Use different API keys for different environments
3. Enable CORS properly for your domains
4. Use HTTPS in production
5. Regularly rotate API keys and secrets
