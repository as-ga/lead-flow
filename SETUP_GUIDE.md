# Setup Guide - LeadFlow

Complete step-by-step guide to set up LeadFlow locally.

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **MongoDB**: Local installation or MongoDB Atlas cloud
- **pnpm**: Package manager (recommended) or npm
- **Git**: For version control

### Check Prerequisites

```bash
# Check Node version
node --version  # Should be v18+

# Check npm/pnpm version
pnpm --version  # or npm --version

# Verify MongoDB
mongosh --version  # If MongoDB installed locally
```

---

## 🚀 Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/as-ga/lead-flow.git
cd lead-flow
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Configure .env file
# Edit .env with your settings (see ENV_GUIDE.md)
```

#### Backend Environment Variables

Edit `server/.env`:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/lead-flow

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

**MongoDB Setup (Local):**

If using local MongoDB:

```bash
# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Or manually
mongod --dbpath /usr/local/var/mongodb

# For Windows/Linux, adjust paths accordingly
```

**Or use MongoDB Atlas (Cloud):**

1. Go to [mongodb.com/cloud](https://mongodb.com/cloud)
2. Create a free cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/lead-flow?retryWrites=true&w=majority`
4. Update `MONGODB_URI` in `.env`

#### Build & Run Backend

```bash
# Build TypeScript
pnpm run build

# Run in development mode (with auto-reload)
pnpm dev

# Or run production build
pnpm start
```

**Expected Output:**

```
Server running on port 5000
Connected to MongoDB
```

---

### 3. Frontend Setup

Open a **new terminal** and navigate to client:

```bash
cd client

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.local

# Configure .env.local
```

#### Frontend Environment Variables

Edit `client/.env.local`:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# App Configuration
NEXT_PUBLIC_APP_NAME=LeadFlow
```

#### Run Frontend

```bash
# Development mode (with hot reload)
pnpm dev

# Or build for production
pnpm build
pnpm start
```

**Expected Output:**

```
> next dev
  ▲ Next.js 16.2.6 (Turbopack)
  - Local: http://localhost:3000
  - Environments: .env.local
```

---

## 🌐 Access Application

| Service     | URL                              | Status             |
| ----------- | -------------------------------- | ------------------ |
| Frontend    | http://localhost:3000            | ✅ Open in browser |
| Backend API | http://localhost:5000            | ✅ For API calls   |
| API Health  | http://localhost:5000/api/health | ✅ GET request     |

---

## 🧪 Test Setup

### Test Backend Health

```bash
curl http://localhost:5000/api/health
# Response: {"status":"OK","timestamp":"..."}
```

### Test Authentication

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "testPassword123",
    "role": "sales_user"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testPassword123"
  }'
```

### Test Frontend

1. Open http://localhost:3000
2. Register new account
3. Login
4. Navigate to dashboard
5. Create test lead

---

## 🐳 Docker Setup

### Prerequisites

- Docker: [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/)

### Docker Quick Start

```bash
# From project root
docker compose up -d

# Wait 30 seconds for services to start
sleep 30

# Verify services
docker compose ps

# Expected: All services in "running" state
```

### Access Services

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:5000 |
| MongoDB  | localhost:27017       |

### Docker Commands

```bash
# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f client
docker compose logs -f server
docker compose logs -f mongodb

# Stop services
docker compose stop

# Stop and remove containers
docker compose down

# Remove all data (volumes)
docker compose down -v

# Rebuild images
docker compose build --no-cache

# Run specific service
docker compose up -d server
```

---

## 📦 Project Structure

```
lead-flow/
├── server/                          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── app.ts                  # Express app setup
│   │   ├── server.ts               # Server entry point
│   │   ├── config/
│   │   │   ├── db.ts               # MongoDB connection
│   │   │   └── env.ts              # Environment config
│   │   ├── middlewares/
│   │   │   └── auth.middleware.ts  # JWT authentication
│   │   ├── models/
│   │   │   ├── user.ts             # User schema
│   │   │   └── lead.ts             # Lead schema
│   │   ├── modules/
│   │   │   ├── auth/               # Authentication routes
│   │   │   └── lead/               # Lead routes
│   │   ├── types/
│   │   │   ├── user.d.ts           # User types
│   │   │   └── lead.d.ts           # Lead types
│   │   └── utils/
│   │       ├── apiHandler.ts       # API response handler
│   │       ├── asyncHandler.ts     # Async middleware
│   │       └── jwt.ts              # JWT utilities
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── .env.example
│   └── .dockerignore
│
├── client/                          # Frontend (Next.js + React)
│   ├── app/
│   │   ├── page.tsx                # Home page
│   │   ├── layout.tsx              # Root layout
│   │   ├── globals.css             # Global styles
│   │   ├── (auth)/                 # Auth routes group
│   │   │   ├── login/page.tsx      # Login page
│   │   │   ├── register/page.tsx   # Register page
│   │   │   └── layout.tsx          # Auth layout
│   │   └── dashboard/              # Dashboard
│   │       ├── page.tsx            # Dashboard main
│   │       └── ...
│   ├── components/
│   │   ├── ui/                     # UI components
│   │   └── ...                     # Feature components
│   ├── lib/
│   │   ├── utils.ts                # Utility functions
│   │   └── api.ts                  # API client
│   ├── public/                     # Static files
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── .env.example
│   └── .dockerignore
│
├── docker-compose.yml              # Docker orchestration
├── .env.docker                     # Docker environment
├── README.md                       # Project overview
├── API_DOCUMENTATION.md            # API docs
├── SETUP_GUIDE.md                  # This file
├── ARCHITECTURE.md                 # Architecture details
└── DEPLOYMENT.md                   # Deployment guide
```

---

## ⚠️ Common Issues

### Issue: "MongoDB connection refused"

**Solution:**

```bash
# Check if MongoDB is running
mongosh

# If not, start it
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows - use MongoDB installer
```

### Issue: "Port 3000 already in use"

**Solution:**

```bash
# Kill process using port 3000
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: "Module not found" errors

**Solution:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: "Environment variable not found"

**Solution:**

```bash
# Verify .env file exists and has correct path
# Check that .env variables are spelled correctly
# Restart development server after changing .env
```

### Issue: Docker containers not starting

**Solution:**

```bash
# Check logs
docker compose logs

# Check image builds
docker compose build --no-cache

# Verify Docker daemon is running
docker ps
```

---

## 🎯 Next Steps

1. **Read API Documentation**: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. **Understand Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)
3. **Environment Configuration**: [ENV_GUIDE.md](./ENV_GUIDE.md)
4. **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 📞 Support

For issues:

1. Check this guide for common problems
2. Review API documentation
3. Check application logs
4. Verify environment variables
5. Check GitHub issues

---

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Docker Guide](https://docs.docker.com/)
