#!/bin/bash

echo "Starting Go server..."
cd server
go run main.go
echo "Running Go server..."
./server &

echo "Starting React frontend..."
cd ../client
npm start
echo "Running React frontend..."
