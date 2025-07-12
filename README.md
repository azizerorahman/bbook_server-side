# BBook Server Side

![BBook API](https://img.shields.io/badge/BBook-API-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green)
![Express](https://img.shields.io/badge/Express-4.18+-orange)
![Node.js](https://img.shields.io/badge/Node.js-14+-brightgreen)

A robust backend API for the BBook warehouse management system. This server provides secure endpoints for managing book inventory, user authentication, and sales tracking with JWT-based security and MongoDB integration.

## Important Links

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-2ea44f?style=for-the-badge&logo=vercel)](https://bbook-0.netlify.app/)
[![Client Repository](https://img.shields.io/badge/Client_Code-GitHub-blue?style=for-the-badge&logo=github)](https://github.com/azizurrahman-zero/bbook_client-side)
[![Server Repository](https://img.shields.io/badge/Server_Code-GitHub-blue?style=for-the-badge&logo=github)](https://github.com/azizurrahman-zero/bbook_server-side)

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)

## Features

- **Book Inventory Management**: Full CRUD operations for book inventory
- **User Authentication**: JWT-based secure authentication system
- **User-specific Data**: Personal book collections with user verification
- **Inventory Tracking**: Real-time quantity and sales tracking
- **Review System**: User review management functionality
- **Secure APIs**: Protected endpoints with token verification
- **MongoDB Integration**: Persistent storage with optimized queries

## Technologies Used

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for storing book and user data
- **JSON Web Token (JWT)**: Secure authentication and authorization
- **dotenv**: Environment variable management
- **CORS**: Cross-Origin Resource Sharing support
- **body-parser**: HTTP request body parsing middleware

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm (Node Package Manager)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/azizurrahman-zero/bbook_server-side.git
   cd bbook_server-side
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with your credentials:

   ``` plaintext
   DB_User=your_mongodb_username
   DB_UPass=your_mongodb_password
   ACCESS_TOKEN_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. Start the server:

   ```bash
   npm start
   # or for development
   npm run start-dev
   ```

5. The server will be running at `http://localhost:5000`

## Environment Variables

| Variable | Description |
|----------|-------------|
| DB_User | MongoDB Atlas username |
| DB_UPass | MongoDB Atlas password |
| ACCESS_TOKEN_SECRET | Secret key for JWT token generation |
| PORT | Server port (defaults to 5000) |

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Server health check endpoint | No |
| POST | `/token` | Generate JWT access token | No |
| GET | `/books` | Get all books in inventory | No |
| GET | `/inventory/:id` | Get specific book by ID | No |
| GET | `/my-books` | Get user's personal book collection | Yes |
| POST | `/books` | Add a new book to inventory | No |
| PUT | `/inventory/:id` | Update book quantity and sales | No |
| DELETE | `/inventory/:id` | Delete a book from inventory | No |
| GET | `/user-reviews` | Get all user reviews | No |

## Project Structure

``` plaintext
bbook_server-side/
├── node_modules/
├── .env
├── .gitignore
├── index.js
├── package-lock.json
├── package.json
└── README.md
```
