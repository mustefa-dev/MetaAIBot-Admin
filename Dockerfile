# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --prefer-offline --no-audit --no-fund
COPY . ./
ARG NUXT_PUBLIC_API_BASE=/api
ENV NUXT_PUBLIC_API_BASE=${NUXT_PUBLIC_API_BASE}
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build
# Show what was generated
RUN echo "=== Checking build output ===" && \
    ls -la .output/ 2>/dev/null || echo "No .output" && \
    ls -la .output/public/ 2>/dev/null || echo "No .output/public" && \
    ls -la dist/ 2>/dev/null || echo "No dist"

# Production stage - nginx for static files
FROM nginx:alpine

# Copy nginx config for SPA
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Try to copy from possible output locations
COPY --from=build /app/.output/public /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
