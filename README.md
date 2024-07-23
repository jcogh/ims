# Inventory Management System (IMS)

## Overview

This Inventory Management System (IMS) is a web-based application designed to help businesses manage their product inventory efficiently. It provides features for tracking products, managing stock levels, and predicting future inventory needs.

## Features

- User Authentication (Sign Up, Login)
- Dashboard with key inventory metrics
- Product Management (Add, Edit, Delete, View)
- Inventory Tracking
- Predictive Analytics for Order Quantities

## Tech Stack

### Frontend
- React
- TypeScript
- Material-UI
- React Router

### Backend
- Go (Golang)
- Gin Web Framework
- GORM (ORM library)
- MySQL Database

## Prerequisites

- Node.js (v14 or later)
- Go (v1.16 or later)
- MySQL

## Setup Instructions

### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/your-username/ims.git
   cd ims/server
   ```

2. Install Go dependencies:
   ```
   go mod tidy
   ```

3. Set up your MySQL database and update the `.env` file with your database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=ims_database
   JWT_SECRET=your_jwt_secret
   ```

4. Run the server:
   ```
   go run main.go
   ```

The server should now be running on `http://localhost:8080`.

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd ../client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The frontend should now be accessible at `http://localhost:3000`.

## API Endpoints

- POST `/api/register` - User registration
- POST `/api/login` - User login
- GET `/api/products` - Fetch all products
- POST `/api/products` - Create a new product
- GET `/api/products/:id` - Fetch a single product
- PUT `/api/products/:id` - Update a product
- DELETE `/api/products/:id` - Delete a product
- GET `/api/predict/:id` - Get order quantity prediction for a product

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
