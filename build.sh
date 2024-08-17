#!/bin/bash

# build frontend
cd frontend-src
npm install
npm run build

# copy built assets to `/src/public`
cd ../
cd deploy-tools
node deploy.js

# build the express server (backend)
cd ../
npm install
