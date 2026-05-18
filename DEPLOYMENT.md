# Deployment Guide - LeadFlow

Complete guide to deploy LeadFlow to production.

---

## 🌍 Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│         Frontend Deployment (Vercel)            │
│  • Next.js optimized production build           │
│  • Automatic deployments on push                │
│  • Edge functions for global performance        │
│  URL: https://ashutosh-lead.vercel.app         │
└─────────────────────────────────────────────────┘
                        ↓
                  Calls API Endpoint
                        ↓
┌─────────────────────────────────────────────────┐
│      Backend Deployment (Render/Railway)        │
│  • Node.js Docker container                     │
│  • Auto-scaling on demand                       │
│  • Environment variable management              │
│  URL: https://api.example.com                  │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│    Database Deployment (MongoDB Atlas)          │
│  • Cloud-hosted MongoDB 6.0                     │
│  • Automated backups                            │
│  • Connection pooling                           │
│  • High availability                            │
└─────────────────────────────────────────────────┘
```

---

## 📦 Frontend Deployment (Vercel)

### Step 1: Prepare Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "feat: prepare for production deployment"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### Step 3: Connect Repository

1. Click "Add New..." → "Project"
2. Select "lead-flow" repository
3. Configure project:
   - **Framework**: Next.js
   - **Root Directory**: `./client`
   - **Build Command**: `pnpm run build` (or `npm run build`)
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

### Step 4: Environment Variables

Add in Vercel dashboard:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_APP_NAME=LeadFlow
```

### Step 5: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Access at `https://your-project.vercel.app`

### Vercel Configuration File

Create `client/vercel.json`:

```json
{
  "buildCommand": "pnpm run build",
  "installCommand": "pnpm install",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_API_URL": "@next_public_api_url"
  }
}
```

---

## 🖥️ Backend Deployment (Render)

### Option 1: Deploy on Render

#### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render

#### Step 2: Create Web Service

1. Click "New +" → "Web Service"
2. Select your GitHub repository
3. Configure:
   - **Name**: lead-flow-server
   - **Environment**: Docker
   - **Plan**: Free (or Starter)
   - **Root Directory**: `server`

#### Step 3: Environment Variables

Add in Render dashboard:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lead-flow
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
CLIENT_URL=https://your-frontend-domain.vercel.app
```

#### Step 4: Deploy

1. Click "Create Web Service"
2. Render builds Docker image
3. Services starts automatically
4. Access API at `https://lead-flow-server.onrender.com`

#### Render Configuration (Optional)

Create `server/render.yaml`:

```yaml
services:
  - type: web
    name: lead-flow-server
    env: docker
    dockerfilePath: ./Dockerfile
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
```

### Option 2: Deploy on Railway

#### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

#### Step 2: Create Project

1. Click "Create"
2. Select "Deploy from GitHub repo"
3. Choose your repository

#### Step 3: Configure Environment

Add variables in Railway:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
CLIENT_URL=https://...
```

#### Step 4: Deploy

Railway auto-deploys on push to main branch.

### Option 3: Deploy on AWS

#### Step 1: Push Docker Image to ECR

```bash
# Authenticate with AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build image
docker build -t lead-flow-server ./server

# Tag image
docker tag lead-flow-server:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/lead-flow-server:latest

# Push to ECR
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/lead-flow-server:latest
```

#### Step 2: Create ECS Task Definition

```json
{
  "family": "lead-flow-server",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "lead-flow-server",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/lead-flow-server:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "5000"
        }
      ]
    }
  ]
}
```

#### Step 3: Launch ECS Service

Use AWS ECS console or CLI to create service with the task definition.

---

## 💾 Database Deployment (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create organization and project

### Step 2: Create Cluster

1. Click "Create" → "Cluster"
2. Select cloud provider and region
3. Choose cluster tier (M0 free for development)
4. Create cluster

### Step 3: Create Database User

1. In Atlas, go to "Database Access"
2. Click "Add New Database User"
3. Set username and password
4. Grant read/write access

### Step 4: Configure Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. For production: Add specific IPs or your server
4. For testing: Add `0.0.0.0/0` (not recommended for production)

### Step 5: Get Connection String

1. Go to "Clusters" → "Connect"
2. Choose "Connect your application"
3. Copy connection string:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/lead-flow?retryWrites=true&w=majority
```

### Step 6: Update Backend Environment

Add to production environment variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/lead-flow
```

---

## ✅ Pre-Deployment Checklist

### Code Quality

- [ ] All tests passing
- [ ] No console.log statements (except in tests)
- [ ] No hardcoded URLs or secrets
- [ ] All TypeScript errors resolved
- [ ] ESLint passes without warnings
- [ ] No unused imports or variables

### Security

- [ ] JWT secrets are strong (32+ characters)
- [ ] Environment variables not committed
- [ ] CORS configured for production domain only
- [ ] HTTPS enabled (automatic with Vercel/Railway)
- [ ] Database credentials in .env only
- [ ] No sensitive data in logs

### Performance

- [ ] Images optimized
- [ ] Code splitting enabled
- [ ] Caching headers configured
- [ ] Database indexes created
- [ ] Pagination implemented

### Monitoring

- [ ] Error tracking setup (Sentry)
- [ ] Logging service configured
- [ ] Health checks implemented
- [ ] Database monitoring enabled

---

## 🔧 Environment Variables

### Frontend (.env.production)

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_APP_NAME=LeadFlow
NODE_ENV=production
```

### Backend (.env.production)

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lead-flow

# JWT Secrets - Use strong, random values
JWT_SECRET=your-32-character-random-secret-key-here-12345
JWT_REFRESH_SECRET=your-32-character-refresh-secret-key-12345

# URLs
CLIENT_URL=https://ashutosh-lead.vercel.app
```

---

## 📊 Monitoring & Logging

### Enable Error Tracking (Sentry)

#### Frontend

```bash
npm install @sentry/nextjs
```

Configure in `next.config.ts`:

```typescript
import { withSentryConfig } from "@sentry/nextjs";

const config = {
  // ... next config
};

export default withSentryConfig(config, {
  org: "your-org",
  project: "lead-flow",
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
```

#### Backend

```bash
npm install @sentry/node @sentry/tracing
```

Configure in `src/server.ts`:

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
```

### Database Monitoring

MongoDB Atlas provides:

- Metrics (CPU, Memory, Operations)
- Query performance insights
- Automated alerts
- Backup status

---

## 🚀 Deployment Workflow

### Automated Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: client

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: curl ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## 📝 Post-Deployment

### Verification

1. Test frontend URL in browser
2. Test API endpoints with cURL
3. Verify authentication flow
4. Test lead CRUD operations
5. Check dark mode toggle
6. Test responsive design

### Health Checks

```bash
# Frontend health
curl -I https://ashutosh-lead.vercel.app

# Backend health
curl https://your-api.com/api/health

# Expected: HTTP 200 OK
```

### Rollback Procedure

**Vercel:**

1. Go to Deployments
2. Select previous deployment
3. Click "Promote to Production"

**Render:**

1. Go to Manual Deploys
2. Click "Deploy" on previous version

**MongoDB Atlas:**

1. Use backups feature to restore
2. Or manually restore from dump

---

## 🔄 Continuous Deployment

### GitHub Actions

Every push to `main` automatically:

1. Runs tests
2. Builds application
3. Deploys to production
4. Sends deployment notification

### Manual Deployment

```bash
# Vercel
vercel --prod

# Railway (automatic on push)
git push origin main

# Custom server
ssh user@server.com
cd /app/lead-flow
git pull origin main
pnpm install
pnpm run build
pm2 restart lead-flow
```

---

## 💡 Performance Optimization

### Frontend

- Next.js Image optimization
- Code splitting & lazy loading
- CSS minification
- JavaScript compression

### Backend

- MongoDB indexing
- Response compression (gzip)
- Connection pooling
- Caching strategy

---

## 🆘 Troubleshooting

### Issue: "CORS Error in Production"

**Solution:**

```typescript
// Update CLIENT_URL in .env
CLIENT_URL=https://your-production-frontend.com
```

### Issue: "Database Connection Timeout"

**Solution:**

```
1. Check MONGODB_URI format
2. Verify IP whitelist in Atlas
3. Test connection string locally
```

### Issue: "Static Assets 404"

**Solution:**

```
Next.js uses /public folder
Ensure images are in client/public/
Reference as /image-name.jpg
```

### Issue: "Environment Variables Not Loading"

**Solution:**

```bash
# Vercel: Re-deploy after changing vars
vercel --prod

# Render: Redeploy service
Railway: Automatic on push
```

---

## 📚 Resources

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## 🎯 Summary

**Deployed Architecture:**

- **Frontend**: Vercel (Global CDN)
- **Backend**: Render/Railway (Scalable containers)
- **Database**: MongoDB Atlas (Managed cloud)

**Status**: 🟢 Production Ready
