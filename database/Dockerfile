# Database Dockerfile - MongoDB
FROM mongo:7.0

LABEL maintainer="kindness-wall"
LABEL description="Database - MongoDB"

# Copy initialization script to create DB and collections on first start
COPY init-db.js /docker-entrypoint-initdb.d/init-db.js

# MongoDB default port
EXPOSE 27017

# Data is persisted via a volume defined in docker-compose.yml
# Default CMD from base image starts mongod
