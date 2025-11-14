#!/bin/bash
set -euo pipefail

# build frontend
cd frontend-src

echo "Cleaning previous frontend build artifacts..."
# remove prior build output and published assets to avoid accumulating stale files
rm -rf build/*
rm -rf ../public/assets/*

npm install

# ensure the production env var is applied to the build command
VITE_ENVIRONMENT=production npm run build:deploy

# restore local env file used for development
printf 'VITE_ENVIRONMENT="development"\n' > .env

# build the express server (backend)
cd ../
npm install
