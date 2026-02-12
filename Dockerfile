FROM node:22-slim

WORKDIR /app

# Install OpenSSL (needed by Prisma)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application code
COPY . .

# Generate Prisma client, create database, and seed
RUN npx prisma generate && \
    npx prisma db push && \
    npm run db:seed

EXPOSE 3000

CMD ["npm", "run", "dev"]
