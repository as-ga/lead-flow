FROM node:20-alpine

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

# Build TypeScript
RUN pnpm run build

# Remove source files and keep only dist
RUN rm -rf src

# Expose port
EXPOSE 5000

# Start server
CMD ["pnpm", "start"]
