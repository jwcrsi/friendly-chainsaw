#!/bin/bash
# Production deployment helper script
# Usage: ./scripts/deploy.sh

set -e

echo "=== RE2 Platform - Production Deployment ==="
echo ""

# Check for required environment variables
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set"
  echo "Set it to your PostgreSQL connection string:"
  echo '  export DATABASE_URL="postgresql://user:password@host:5432/re2_platform?sslmode=require"'
  exit 1
fi

if [ -z "$AUTH_SECRET" ]; then
  echo "ERROR: AUTH_SECRET is not set"
  echo "Generate one with: openssl rand -base64 32"
  exit 1
fi

echo "1. Installing dependencies..."
npm install

echo ""
echo "2. Generating Prisma client..."
npx prisma generate --schema=prisma/schema.postgres.prisma

echo ""
echo "3. Running database migrations..."
npx prisma db push --schema=prisma/schema.postgres.prisma

echo ""
echo "4. Building Next.js application..."
npm run build

echo ""
echo "=== Deployment ready! ==="
echo ""
echo "To start the production server:"
echo "  npm start"
echo ""
echo "To deploy to Vercel:"
echo "  npx vercel --prod"
echo ""
echo "Default demo login:"
echo "  Email: demo@re2.ai"
echo "  Password: password123"
echo "  (Run: node prisma/seed.cjs to create demo data)"
