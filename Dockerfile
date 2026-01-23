# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --prefer-offline --no-audit --no-fund
COPY . ./
ARG NUXT_PUBLIC_API_BASE=https://misk-city-api.taco5k.site
ENV NUXT_PUBLIC_API_BASE=${NUXT_PUBLIC_API_BASE}
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build

# Production stage - lightweight node server
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/.output/public ./public
EXPOSE 3000
CMD ["serve", "-s", "public", "-l", "3000"]
