# Library Management System

A frontend-only library management app designed to run as a static site on GitHub Pages.

## Features
- Admin login and registration
- Book management
- Member management
- Borrow and return tracking
- Dashboard with statistics
- Uses browser local storage so no backend is required

## Default Admin Login
- Email: admin@example.com
- Password: admin123

## Frontend-only deployment
This project is configured for GitHub Pages deployment.

### Run locally
```bash
cd client
npm install
npm start
```

### Deploy to GitHub Pages
```bash
cd client
npm install
npm run deploy
```

This will generate the production build and publish it to GitHub Pages using the configured homepage URL.

## GitHub Pages URL
https://AyeshaShaik08.github.io/Library-Management

## Notes
This version is intentionally backend-free so it can be hosted as a simple static frontend in GitHub.
