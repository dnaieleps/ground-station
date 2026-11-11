# Multi-stage build: stage 1 compiles the Vite/React app with Node,
# stage 2 serves the static output with nginx (small, production-ready image).

# ---------- Stage 1: build ----------
FROM node:22-alpine AS build

WORKDIR /app

# install dependencies first so this layer is cached unless package files change
COPY package.json package-lock.json ./
RUN npm ci

# copy the rest of the source and build to /app/dist
COPY . .
RUN npm run build

# ---------- Stage 2: serve ----------
FROM nginx:1.27-alpine

# nginx config: listen on 9000 and fall back to index.html for client-side routes
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy only the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 9000

CMD ["nginx", "-g", "daemon off;"]
