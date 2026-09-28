# Library Management System

A full-stack MERN application for managing library books, members, and borrowing activity.

## Features
- Admin login and registration
- Add, edit, delete, and view books
- Add and manage members
- Issue and return books
- Track transaction history
- Dashboard with statistics
- React frontend with Express + MongoDB backend

## Tech Stack
- Frontend: React, React Router, Axios
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Security: JWT authentication and bcrypt hashing

## Project Structure

```bash
Library Management/
├── client/
│   ├── public/
│   ├── src/
│   ├── README.md
│   └── package.json
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── seeds/
│   ├── .env.example
│   ├── README.md
│   ├── server.js
│   └── package.json
├── .gitignore
├── README.md
└── .github/
```

## Default Admin Login

The app seeds an admin account automatically:

- Email: admin@example.com
- Password: admin123

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/AyeshaShaik08/Library-Management.git
cd Library-Management
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server` folder based on `.env.example`.

Example:

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/library-management
JWT_SECRET=your_secret_key
```

### 4. Start the backend

```bash
npm run dev
```

### 5. Install frontend dependencies

Open a new terminal and run:

```bash
cd client
npm install
npm start
```

The React app should run on the default port, usually `http://localhost:3000`.

## Useful Commands

### Backend

```bash
cd server
npm run dev
npm run seed
```

### Frontend

```bash
cd client
npm start
npm run build
```

## Notes
This application is designed as a simple library management system for learning, demos, and academic projects.
