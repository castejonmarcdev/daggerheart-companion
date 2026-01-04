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

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Install production dependencies for backend
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy built backend
COPY --from=backend-builder /app/backend/dist ./dist

# Copy built web-app to serve as static files
COPY --from=web-builder /app/web-app/dist ./public

# Copy resources (rules and character sheets)
COPY resources ./resources

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Start the server
CMD ["node", "dist/index.js"]
