# Docker Setup Guide - LeadFlow

Complete guide to containerize and run LeadFlow with Docker.

---

## 🐳 What is Docker?

Docker is a containerization platform that packages your entire application with all dependencies into a container. Benefits:

- **Consistency**: Works same on dev, staging, production
- **Portability**: Run on any machine with Docker
- **Isolation**: Each service in its own container
- **Scalability**: Easy to scale services

---

## 📋 Prerequisites

### Install Docker

**macOS:**

```bash
# Using Homebrew
brew install docker

# Or download Docker Desktop
# https://www.docker.com/products/docker-desktop
```

**Windows/Linux:**

- Download [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Install and start Docker daemon

### Verify Installation

```bash
# Check Docker version
docker --version
# Output: Docker version 24.x.x

# Check Docker Compose version
docker compose version
# Output: Docker Compose version v2.x.x

# Test Docker
docker run hello-world
```

---

## 🏗️ Docker Architecture

LeadFlow uses Docker Compose to orchestrate 3 services:

```
┌─────────────────────────────────────────────────┐
│         Docker Compose Network                  │
│  (lead-flow-network)                            │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐           │
│  │   MongoDB    │  │   Server     │           │
│  │   :27017     │  │   :5000      │           │
│  └──────────────┘  └──────────────┘           │
│         │                 │                    │
│         └─────────────────┘                    │
│                 │                              │
│         ┌───────▼────────┐                    │
│         │    Client      │                    │
│         │    :3000       │                    │
│         └────────────────┘                    │
│              ▲                                │
│              │                                │
│         Host Port :3000                      │
│                                               │
└─────────────────────────────────────────────────┘
```

---

## 📁 Docker Files

### Dockerfile Structure

**Server Dockerfile** (`server/Dockerfile`):

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm run build
EXPOSE 5000
CMD ["pnpm", "start"]
```

**Client Dockerfile** (`client/Dockerfile`):

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install
COPY . .
RUN pnpm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json ./
RUN pnpm install --prod
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
ENV HOSTNAME=0.0.0.0 PORT=3000
CMD ["pnpm", "start"]
```

### docker-compose.yml

```yaml
version: "3.8"

services:
  mongodb:
    image: mongo:6.0
    container_name: lead-flow-mongodb
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
    volumes:
      - mongodb_data:/data/db
    ports:
      - "27017:27017"
    networks:
      - lead-flow-network

  server:
    build:
      context: ./server
    container_name: lead-flow-server
    environment:
      NODE_ENV: production
      PORT: 5000
      MONGODB_URI: mongodb://admin:password123@mongodb:27017/lead-flow?authSource=admin
      JWT_SECRET: leadflow_jwt_secret_key_2026_production_change_this
      JWT_REFRESH_SECRET: leadflow_jwt_refresh_secret_key_2026_production_change_this
      CLIENT_URL: http://localhost:3000
    ports:
      - "5000:5000"
    depends_on:
      mongodb:
        condition: service_started
    networks:
      - lead-flow-network

  client:
    build:
      context: ./client
    container_name: lead-flow-client
    environment:
      NEXT_PUBLIC_API_URL: http://server:5000/api
      NODE_ENV: production
      PORT: 3000
      HOSTNAME: 0.0.0.0
    ports:
      - "3000:3000"
    depends_on:
      server:
        condition: service_started
    networks:
      - lead-flow-network

volumes:
  mongodb_data:

networks:
  lead-flow-network:
    driver: bridge
```

### .dockerignore Files

**server/.dockerignore:**

```
node_modules
npm-debug.log
.git
.env
.DS_Store
dist
*.log
```

**client/.dockerignore:**

```
node_modules
npm-debug.log
.git
.env.local
.DS_Store
.next
build
*.log
.vercel
```

---

## 🚀 Quick Start

### 1. Start All Services

```bash
cd lead-flow

# Start all containers
docker compose up -d

# Wait 30 seconds for services to initialize
sleep 30

# Verify services are running
docker compose ps
```

**Expected Output:**

```
NAME                    STATUS
lead-flow-client        running
lead-flow-server        running
lead-flow-mongodb       running
```

### 2. Access Services

```
Frontend:  http://localhost:3000
Backend:   http://localhost:5000
MongoDB:   localhost:27017
```

### 3. Test Connection

```bash
# Test API
curl http://localhost:5000/api/health
# Response: {"status":"OK","timestamp":"2026-05-19T..."}

# Test Frontend
curl -I http://localhost:3000
# Response: HTTP/1.1 200 OK
```

### 4. Stop Services

```bash
docker compose stop
```

---

## 📊 Docker Commands

### View Services

```bash
# List running containers
docker compose ps

# Show detailed status
docker compose ps -a

# Show all images
docker images
```

### Logs

```bash
# View all logs
docker compose logs

# Follow logs (live)
docker compose logs -f

# View specific service
docker compose logs -f server
docker compose logs -f client
docker compose logs -f mongodb
```

### Build

```bash
# Build all images
docker compose build

# Rebuild without cache
docker compose build --no-cache

# Build specific service
docker compose build server
```

### Start/Stop

```bash
# Start services (in background)
docker compose up -d

# Start specific service
docker compose up -d server

# Stop services
docker compose stop

# Stop specific service
docker compose stop client

# Stop and remove containers
docker compose down

# Remove containers and volumes
docker compose down -v
```

### Execute Commands

```bash
# Execute command in container
docker compose exec server sh

# Run database operations
docker compose exec mongodb mongosh

# Install dependencies
docker compose exec server pnpm install
```

---

## 🔧 Troubleshooting

### Issue: "Port already in use"

```bash
# Find service using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port in docker-compose.yml
# Change "3000:3000" to "3001:3000"
```

### Issue: "Container exit with code 1"

```bash
# Check logs
docker compose logs server

# Common causes:
# 1. Missing environment variables
# 2. Database connection failed
# 3. Port conflict
# 4. Build error
```

### Issue: "Cannot connect to MongoDB"

```bash
# Verify MongoDB is running
docker compose ps mongodb

# Check MongoDB logs
docker compose logs mongodb

# Verify connection string
docker compose exec server sh
echo $MONGODB_URI

# Test connection
docker compose exec mongodb mongosh -u admin -p
```

### Issue: "Build fails"

```bash
# Rebuild from scratch
docker compose build --no-cache

# Check Dockerfile syntax
docker build ./server --no-cache

# View build logs
docker compose build --progress=plain
```

### Issue: "API not accessible from client"

```bash
# Use service hostname (not localhost)
# In client env: http://server:5000/api

# NOT: http://localhost:5000/api
```

---

## 📦 Volume Management

### Understanding Volumes

Volumes persist data when containers stop:

```yaml
volumes:
  mongodb_data: # Named volume
```

### Volume Commands

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect lead-flow_mongodb_data

# Remove unused volumes
docker volume prune

# Remove specific volume
docker volume rm lead-flow_mongodb_data
```

### Backup MongoDB Data

```bash
# Export data
docker compose exec mongodb mongodump -u admin -p password123 -o /backup

# Import data
docker compose exec mongodb mongorestore -u admin -p password123 /backup
```

---

## 🔐 Security Considerations

### Change Default Credentials

**In .env.docker or docker-compose.yml:**

```env
# MongoDB
MONGO_INITDB_ROOT_USERNAME=your_secure_username
MONGO_INITDB_ROOT_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your_secure_secret_32_chars_min
JWT_REFRESH_SECRET=your_secure_secret_32_chars_min
```

### Network Security

```yaml
# Only expose necessary ports
ports:
  - "3000:3000" # Frontend
  - "5000:5000" # Backend API
  # MongoDB NOT exposed (internal only)

# Use custom network
networks:
  lead-flow-network:
    driver: bridge
```

### Environment Variables

```bash
# Don't hardcode in Dockerfile
# Use environment variables instead

# ✅ Good
ENV NODE_ENV=production
ENV PORT=5000

# ❌ Bad
RUN echo "DATABASE_PASSWORD=mypassword" >> .env
```

---

## 📈 Performance Optimization

### Multi-Stage Build

Reduces final image size:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN pnpm run build

# Production stage (smaller image)
FROM node:20-alpine
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]
```

### Layer Caching

Order matters for build speed:

```dockerfile
# Change files less frequently at top
FROM node:20-alpine
WORKDIR /app
COPY package.json .        # Static, cached

RUN pnpm install           # Cached unless package.json changes

COPY . .                   # Dynamic, always rebuilt
RUN pnpm run build
```

### Resource Limits

```yaml
services:
  server:
    deploy:
      resources:
        limits:
          cpus: "1"
          memory: 512M
        reservations:
          cpus: "0.5"
          memory: 256M
```

---

## 🔍 Monitoring

### Container Stats

```bash
# Real-time resource usage
docker stats

# CPU, Memory, Network I/O for all containers
docker compose stats
```

### Health Checks

Add to docker-compose.yml:

```yaml
services:
  server:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

---

## 🚀 Advanced Setup

### Environment-Specific Compose Files

```bash
# Development
docker compose -f docker-compose.dev.yml up

# Production
docker compose -f docker-compose.prod.yml up -d
```

### Compose Override File

```yaml
# docker-compose.override.yml (development only)
services:
  server:
    environment:
      DEBUG: "true"
      LOG_LEVEL: "debug"
```

---

## 📚 Docker Best Practices

✅ **DO:**

- Use alpine images (smaller)
- Create .dockerignore files
- Run as non-root user
- Use multi-stage builds
- Tag images with versions
- Document Dockerfile

❌ **DON'T:**

- Store secrets in images
- Run containers as root
- Use :latest tags in production
- Have huge layers
- Ignore security scanning

---

## 🔗 Related Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Installation guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- [ENV_GUIDE.md](./ENV_GUIDE.md) - Environment variables

---

## 📞 Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Security](https://docs.docker.com/engine/security/)
