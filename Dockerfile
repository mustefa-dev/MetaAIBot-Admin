# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --prefer-offline --no-audit --no-fund
COPY . ./
ARG NUXT_PUBLIC_API_BASE=/api
ENV NUXT_PUBLIC_API_BASE=${NUXT_PUBLIC_API_BASE}
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run generate
# Debug: show what was generated
RUN ls -la .output/ || echo "No .output directory"
RUN ls -la .output/public/ || echo "No .output/public directory"
RUN ls -la dist/ || echo "No dist directory"

# Production stage - nginx for static files
FROM nginx:alpine
COPY --from=build /app/.output/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
