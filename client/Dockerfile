# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json ./
COPY pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source code
COPY . .

# Build Next.js app
RUN pnpm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package.json for reference
COPY package.json ./

# Copy built application and necessary files from builder
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/node_modules /app/node_modules

# Expose port
EXPOSE 3000

# Make sure Next.js listens on all interfaces
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Start app
CMD ["npx", "next", "start"]
