# Server API

This folder contains the Express backend for the Library Management System.

## Run locally

```bash
cd server
npm install
npm run dev
```

## Seed demo data

```bash
cd server
node seeds/seed.js
```

## Environment variables

Create a `.env` file with:

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/library-management
JWT_SECRET=your_secret_key
```

## Default admin account
- Email: admin@example.com
- Password: admin123
