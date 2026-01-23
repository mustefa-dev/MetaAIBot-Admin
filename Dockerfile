# Frontend with nginx proxy
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --prefer-offline --no-audit --no-fund
COPY . ./
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run generate

FROM nginx:alpine
# Copy built frontend
COPY --from=build /app/.output/public /usr/share/nginx/html
# Copy nginx config template
COPY nginx.frontend.conf /etc/nginx/templates/default.conf.template
EXPOSE 80

# Default API host - change via environment variable
ENV API_HOST=metabot-api

CMD ["nginx", "-g", "daemon off;"]