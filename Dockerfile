# Build stage for web-app
FROM node:20-alpine AS web-builder
WORKDIR /app/web-app
COPY web-app/package*.json ./
RUN npm ci
COPY web-app/ ./
RUN npm run build

# Build stage for backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

# Production stage with MongoDB
FROM ubuntu:22.04 AS production

# Install Node.js and MongoDB
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg \
    && echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list \
    && apt-get update \
    && apt-get install -y nodejs mongodb-org \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create MongoDB data directory
RUN mkdir -p /data/db

WORKDIR /app

# Copy package.json and install production dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy built backend
COPY --from=backend-builder /app/backend/dist ./dist

# Copy built web-app to serve as static files
COPY --from=web-builder /app/web-app/dist ./public

# Copy resources (rules and character sheets)
COPY resources ./resources

# Copy seed script and source files for seeding
COPY --from=backend-builder /app/backend/dist/scripts ./dist/scripts
COPY --from=backend-builder /app/backend/dist/models ./dist/models
COPY --from=backend-builder /app/backend/dist/config ./dist/config

# Copy startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0
ENV MONGODB_URI=mongodb://127.0.0.1:27017/daggerheart

# Start MongoDB and the server
CMD ["/docker-entrypoint.sh"]
