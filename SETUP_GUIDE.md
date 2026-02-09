# Password Strength Checker — Setup Guide

This guide walks you through setting up the full stack app (Angular frontend + Node/Express backend + MongoDB) with the new login/register flow.

## Quick Overview

- Frontend: Angular app served at http://localhost:4200
- Backend: Express API at http://localhost:5000
- Database: MongoDB
- Auth: JWT-based login/register

## Project Structure (high level)

```
password-strength-cheacker/
├── frontend/     # Angular UI
└── backend/      # Express API + MongoDB
```

## Prerequisites

- Node.js 18+ recommended (14+ works, but 18+ is better)
- MongoDB (local or Docker)
- npm

## 1) Backend Setup

### Install dependencies

```
cd backend
npm install
```

### Environment variables

Create `.env` in the backend folder:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/password-strength-checker
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
JWT_SECRET=change-this-in-production
```

### Start MongoDB

Local (Linux):
```
sudo systemctl start mongod
```

Docker:
```
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Run the backend

```
npm run dev
```

Backend will be live at http://localhost:5000

## 2) Frontend Setup

### Install dependencies

```
cd frontend
npm install
```

### Run the frontend

```
npm start
```

Frontend will be live at http://localhost:4200

## 3) App Routes (Frontend)

- / — password checker
- /login — sign in
- /register — create account

When logged in, the navbar shows user info and a Sign out button.

## 4) Auth API (Backend)

Base URL: http://localhost:5000/api

### Auth endpoints

- POST /auth/register
- POST /auth/login
- POST /auth/logout
- GET /auth/me (requires valid cookie)

### Example login payload

```
{
  "identifier": "yourUsernameOrEmail",
  "password": "yourPassword"
}
```

### Example register payload

```
{
  "username": "yourUsername",
  "email": "you@example.com",
  "password": "yourPassword",
  "firstName": "Optional",
  "lastName": "Optional"
}
```

### Token Storage

Tokens are stored in **secure, HTTP-only cookies** (`psc_token`). The browser automatically sends them with requests (via `withCredentials: true` in Angular). Tokens expire after 7 days.

## 5) Password API

- POST /passwords — save a password
- GET /passwords/user/:userId — list user passwords
- GET /passwords/user/:userId/stats — stats
- GET /passwords/user/:userId/search?query=term — search
- PUT /passwords/:id — update notes/tags
- DELETE /passwords/:id — delete one
- DELETE /passwords/user/:userId/all — delete all

## 6) Database Models (summary)

### User
- username, email, passwordHash, firstName, lastName

### Password
- userId, password, strength, strengthScore, mode, tags, notes, createdAt

## 7) Common Issues

### MongoDB connection error
Make sure MongoDB is running and `MONGODB_URI` is correct.

### CORS error
Make sure `CORS_ORIGIN` matches your frontend URL.

### Port in use
Change `PORT` in `.env` or stop the process using that port.

## 8) Production Notes

- Change `JWT_SECRET`
- Use HTTPS
- Add rate limiting and input validation

## Support

Open an issue in the repository if you hit problems.
