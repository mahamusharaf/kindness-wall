# Frontend Dockerfile - Nginx serving static HTML/CSS/JS
FROM nginx:alpine

LABEL maintainer="kindness-wall"
LABEL description="Frontend - Static HTML/CSS/JS served by Nginx"

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy frontend static files
COPY . /usr/share/nginx/html/

# Copy custom nginx config to proxy API calls to backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
