# Multi-stage build for optimized production image
FROM node:20-alpine AS base

# Build stage
FROM base AS builder
WORKDIR /app

# Declare build arg for API URL (passed from docker-compose)
ARG VITE_API_URL=http://localhost:5001/api
# Make it available to Vite at build time
ENV VITE_API_URL=$VITE_API_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build production bundle (Vite reads VITE_* env vars)
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine AS production

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
