#!/bin/bash

# Build and run Go server
echo "Starting Go server..."
cd server
go run main.go
echo "Running Go server..."
./server &

# Build and run React frontend
echo "Starting React frontend..."
cd ../client
npm start
echo "Running React frontend..."
