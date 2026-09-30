# Stage 1: Install Dependencies
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Production Lightweight Image with Non-Root User
FROM node:18-alpine AS runner

WORKDIR /app

# Copy production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Security Best Practice: Use non-root node user
USER node

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "src/server.js"]
