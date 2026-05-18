# Environment Variables Guide - LeadFlow

Complete guide to environment configuration for all environments.

---

## 📋 Overview

LeadFlow uses environment variables to manage configuration across different environments:

- **Development** - Local development
- **Docker** - Docker Compose local setup
- **Production** - Live deployment

---

## 🔧 Backend Configuration

### Development (.env)

Create `server/.env`:

```env
# ==================== Server Configuration ====================
NODE_ENV=development
PORT=5000

# ==================== Database ====================
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/lead-flow

# MongoDB Atlas (Cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/lead-flow?retryWrites=true&w=majority

# ==================== JWT Secrets ====================
# Use strong, random strings (min 32 characters)
JWT_SECRET=your_local_jwt_secret_key_here_change_in_production
JWT_REFRESH_SECRET=your_local_jwt_refresh_secret_key_change_in_production

# ==================== URLs ====================
CLIENT_URL=http://localhost:3000
```

**Generating JWT Secrets:**

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Example output:
# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# Using openssl
openssl rand -hex 32
```

### Docker Configuration (.env.docker)

Create `server/.env.docker`:

```env
# ==================== Server Configuration ====================
NODE_ENV=production
PORT=5000

# ==================== Database (Docker Service) ====================
# Use 'mongodb' hostname (Docker DNS)
MONGODB_URI=mongodb://admin:password123@mongodb:27017/lead-flow?authSource=admin

# ==================== JWT Secrets ====================
JWT_SECRET=leadflow_jwt_secret_key_2026_production_change_this
JWT_REFRESH_SECRET=leadflow_jwt_refresh_secret_key_2026_production_change_this

# ==================== URLs ====================
CLIENT_URL=http://localhost:3000
```

### Production Configuration

**Option 1: Vercel/Render Dashboard**

Add environment variables in:

- Vercel: Settings → Environment Variables
- Render: Environment → Environment Variables

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lead-flow
JWT_SECRET=your_production_jwt_secret_32_chars_min
JWT_REFRESH_SECRET=your_production_refresh_secret_32_chars_min
CLIENT_URL=https://ashutosh-lead.vercel.app
```

**Option 2: .env.production (for self-hosted)**

```env
# ==================== Server Configuration ====================
NODE_ENV=production
PORT=5000

# ==================== Database (Production) ====================
MONGODB_URI=mongodb+srv://prod_user:secure_password@prod-cluster.mongodb.net/lead-flow?retryWrites=true&w=majority

# ==================== JWT Secrets (Use Strong Keys!) ====================
JWT_SECRET=hPq9kL2mN8xR4vT7wB1cD3eF5gJ6sK0aS2dF4gH6jM8pQ0rT2vW4xZ6aB8cD0eF2g
JWT_REFRESH_SECRET=kL3mN9oP2qR5sT8uV1wX4yZ7aB0cD3eF6gH9iJ2kL5mN8oP1qR4sT7uV0wX3yZ6a

# ==================== URLs ====================
CLIENT_URL=https://ashutosh-lead.vercel.app
```

---

## 🌐 Frontend Configuration

### Development (.env.local)

Create `client/.env.local`:

```env
# ==================== API Configuration ====================
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# ==================== App Configuration ====================
NEXT_PUBLIC_APP_NAME=LeadFlow
NEXT_PUBLIC_APP_VERSION=1.0.0

# ==================== Node Environment ====================
NODE_ENV=development
```

**Note:** `NEXT_PUBLIC_` prefix makes variables available in browser.

### Docker Configuration

The Docker setup inherits from environment variables in `docker-compose.yml`:

```yaml
environment:
  NEXT_PUBLIC_API_URL: http://server:5000/api
  NODE_ENV: production
  PORT: 3000
  HOSTNAME: 0.0.0.0
```

### Production Configuration

**Vercel Environment Variables:**

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_APP_NAME=LeadFlow
NODE_ENV=production
```

Add in Vercel:

1. Settings → Environment Variables
2. Add each variable
3. Select environments (Production, Preview, Development)
4. Save

---

## 🐳 Docker Compose Configuration

File: `docker-compose.yml`

```yaml
services:
  mongodb:
    image: mongo:6.0
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: lead-flow
    # ... rest of config

  server:
    environment:
      NODE_ENV: production
      PORT: 5000
      MONGODB_URI: mongodb://admin:password123@mongodb:27017/lead-flow?authSource=admin
      JWT_SECRET: leadflow_jwt_secret_key_2026_production_change_this
      JWT_REFRESH_SECRET: leadflow_jwt_refresh_secret_key_2026_production_change_this
      CLIENT_URL: http://localhost:3000

  client:
    environment:
      NEXT_PUBLIC_API_URL: http://server:5000/api
      NODE_ENV: production
      PORT: 3000
      HOSTNAME: 0.0.0.0
```

---

## ✅ Variable Reference

### Backend Variables

| Variable             | Required | Default | Environment | Description                         |
| -------------------- | -------- | ------- | ----------- | ----------------------------------- |
| `NODE_ENV`           | Yes      | -       | All         | `development`, `production`, `test` |
| `PORT`               | Yes      | 5000    | All         | Server port                         |
| `MONGODB_URI`        | Yes      | -       | All         | MongoDB connection string           |
| `JWT_SECRET`         | Yes      | -       | All         | JWT signing secret (min 32 chars)   |
| `JWT_REFRESH_SECRET` | Yes      | -       | All         | Refresh token secret (min 32 chars) |
| `CLIENT_URL`         | Yes      | -       | All         | Frontend URL (for CORS)             |

### Frontend Variables

| Variable                  | Required | Default  | Environment | Description                 |
| ------------------------- | -------- | -------- | ----------- | --------------------------- |
| `NEXT_PUBLIC_API_URL`     | Yes      | -        | All         | Backend API base URL        |
| `NEXT_PUBLIC_APP_NAME`    | No       | LeadFlow | All         | Application name            |
| `NEXT_PUBLIC_APP_VERSION` | No       | -        | Development | App version display         |
| `NODE_ENV`                | Yes      | -        | All         | `development`, `production` |

---

## 🔐 Security Best Practices

### 1. Secret Management

✅ **DO:**

- Use strong random secrets (32+ characters)
- Rotate secrets periodically
- Store in secure environment managers
- Use different secrets per environment

❌ **DON'T:**

- Hardcode secrets in code
- Use simple/predictable secrets
- Commit .env files to git
- Share secrets via email/chat

### 2. CORS Configuration

```env
# Only allow your frontend domain
CLIENT_URL=https://ashutosh-lead.vercel.app

# NOT this (too permissive):
# CLIENT_URL=*
```

### 3. Database Credentials

```env
# Use strong passwords
MONGODB_URI=mongodb+srv://strong_user:very_secure_password@cluster.mongodb.net/lead-flow

# In Docker, use unique credentials
MONGO_INITDB_ROOT_PASSWORD=secure_password_123
```

### 4. JWT Configuration

```env
# Example of strong JWT secrets:
JWT_SECRET=hPq9kL2mN8xR4vT7wB1cD3eF5gJ6sK0aS2dF4gH6jM8pQ0rT2vW4xZ6aB8cD0eF2g

# Generate using:
# Node: require('crypto').randomBytes(32).toString('hex')
# OpenSSL: openssl rand -hex 32
```

---

## 🗂️ .env.example Files

### server/.env.example

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/lead-flow

# JWT Secrets
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here

# URLs
CLIENT_URL=http://localhost:3000
```

### client/.env.example

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# App Configuration
NEXT_PUBLIC_APP_NAME=LeadFlow
```

---

## 🔄 Environment-Specific Setup

### Development

```bash
# Backend
cd server
cp .env.example .env
# Edit .env with local values
pnpm dev

# Frontend (new terminal)
cd client
cp .env.example .env.local
# Edit .env.local
pnpm dev
```

### Docker

```bash
# All configuration in docker-compose.yml and .env.docker
docker compose up -d

# Environment variables automatically loaded
```

### Production (Render)

1. Go to Render dashboard
2. Service → Environment
3. Add variables:
   - NODE_ENV: production
   - PORT: 5000
   - MONGODB_URI: [cloud connection]
   - JWT_SECRET: [strong random secret]
   - JWT_REFRESH_SECRET: [strong random secret]
   - CLIENT_URL: https://your-frontend.com

---

## 🧪 Testing Environment Variables

### Verify Backend

```bash
cd server

# Test that env is loaded
node -e "console.log(process.env.MONGODB_URI)"

# Should output your MongoDB URI
```

### Verify Frontend

```bash
cd client

# Build with env variables
pnpm build

# Check that variables are available
node -e "console.log(process.env.NEXT_PUBLIC_API_URL)"
```

### Docker Test

```bash
# Start services
docker compose up -d

# Check server env
docker compose exec server sh -c 'echo $MONGODB_URI'

# Check logs
docker compose logs server | grep "Connected"
```

---

## 📊 Environment Comparison

| Aspect     | Development      | Docker           | Production             |
| ---------- | ---------------- | ---------------- | ---------------------- |
| Database   | Local MongoDB    | Docker MongoDB   | MongoDB Atlas          |
| API URL    | `localhost:5000` | `server:5000`    | HTTPS API domain       |
| Frontend   | `localhost:3000` | `localhost:3000` | Vercel domain          |
| JWT Secret | Any (test value) | Generated        | Strong (32+ chars)     |
| CORS       | localhost        | Docker network   | Production domain only |
| Logging    | Console          | Docker logs      | Sentry/LogRocket       |

---

## 🔗 MongoDB Connection Strings

### Local MongoDB

```env
MONGODB_URI=mongodb://localhost:27017/lead-flow
```

### Docker MongoDB

```env
MONGODB_URI=mongodb://admin:password123@mongodb:27017/lead-flow?authSource=admin
```

### MongoDB Atlas Cloud

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/lead-flow?retryWrites=true&w=majority
```

**Get Connection String:**

1. Go to mongodb.com/cloud/atlas
2. Create cluster
3. Click "Connect"
4. Choose "Connect your application"
5. Copy URI and update username/password

---

## 🆘 Troubleshooting

### Issue: "Environment variable not found"

```bash
# Solution: Check if .env file exists
ls -la server/.env

# Ensure variables are exported in process
echo $NODE_ENV

# Restart development server after .env changes
# Kill process and restart: pnpm dev
```

### Issue: "CORS errors in production"

```env
# Make sure CLIENT_URL matches exactly
CLIENT_URL=https://ashutosh-lead.vercel.app

# Not:
# CLIENT_URL=https://ashutosh-lead.vercel.app/
```

### Issue: "Database connection fails"

```bash
# Test connection string
mongosh "mongodb://localhost:27017/lead-flow"

# For Atlas, verify:
# 1. Connection string is correct
# 2. IP is whitelisted
# 3. Database user exists
# 4. Database name matches
```

---

## 📚 Related Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Installation steps
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture overview
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference

---

## 📝 Checklist

- [ ] Created `.env` in server/
- [ ] Created `.env.local` in client/
- [ ] Added all required variables
- [ ] Used strong JWT secrets (32+ chars)
- [ ] Updated MONGODB_URI (local or cloud)
- [ ] Verified CLIENT_URL for CORS
- [ ] Set NODE_ENV correctly per environment
- [ ] Never committed .env files
- [ ] Tested database connection
- [ ] Verified API is accessible
