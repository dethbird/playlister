#!/bin/bash

# build frontend
cd frontend-src
npm install
VITE_ENVIRONMENT="production" && npm run build:deploy
echo VITE_ENVIRONMENT="development" > .env

# build the express server (backend)
cd ../
npm install
