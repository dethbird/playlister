#!/bin/bash

# build frontend
cd frontend-src
npm install
echo VITE_ENVIRONMENT="production" > .env
npm run build
echo VITE_ENVIRONMENT="development" > .env

# copy built assets to `/src/public`
cd ../
cd deploy-tools
node deploy.js

# build the express server (backend)
cd ../
npm install
