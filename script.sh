#!/bin/bash

# Build and run Go server
echo "Building Go server..."
cd server
go build -o server
echo "Running Go server..."
./server &

# Build and run React frontend
echo "Building React frontend..."
cd ../client
npm install
npm run build
echo "Running React frontend..."
npm start
