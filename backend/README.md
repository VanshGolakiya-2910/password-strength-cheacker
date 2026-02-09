# Password Strength Checker - Backend API

A Node.js/Express backend API for saving and managing password strength checks and generated passwords with MongoDB.

## Features

- Save passwords with strength scores and feedback
- Support for three checking modes: Basic, Intermediate, Advanced
- User management system
- Password statistics and analytics
- Search and filter saved passwords
- Tags and notes for password organization

## Requirements

- Node.js 14.x or higher
- MongoDB 4.4 or higher
- npm or yarn

## Installation

1. Clone the repository
```bash
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`)
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string and settings:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/password-strength-checker
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check if backend is running

### Password Management

#### Save Password
- **POST** `/api/passwords`
- **Body:**
```json
{
  "userId": "user123",
  "password": "SecureP@ss123",
  "mode": "basic",
  "strength": "Very Strong",
  "strengthScore": 90,
  "isGenerated": false,
  "feedback": ["Strong password"],
  "personalDetails": {
    "firstName": "John",
    "lastName": "Doe",
    "birthDate": "1990-01-01"
  },
  "tags": ["work", "important"],
  "notes": "My main password"
}
```

#### Get User Passwords
- **GET** `/api/passwords/user/:userId?limit=20&skip=0`
- Returns paginated list of all passwords for a user

#### Get Password Statistics
- **GET** `/api/passwords/user/:userId/stats`
- Returns statistics including:
  - Total passwords saved
  - Number of generated passwords
  - Average strength score
  - Strength distribution
  - Mode distribution

#### Search Passwords
- **GET** `/api/passwords/user/:userId/search?query=work`
- Searches by tags, notes, or strength

#### Get Password by ID
- **GET** `/api/passwords/:id`
- Returns specific password record

#### Update Password
- **PUT** `/api/passwords/:id`
- **Body:**
```json
{
  "notes": "Updated notes",
  "tags": ["work", "updated"]
}
```

#### Delete Password
- **DELETE** `/api/passwords/:id`
- Deletes a specific password record

#### Delete All User Passwords
- **DELETE** `/api/passwords/user/:userId/all`
- Deletes all passwords for a user

### User Management

#### Create User
- **POST** `/api/users`
- **Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Get All Users
- **GET** `/api/users?limit=20&skip=0`
- Returns paginated list of users

#### Get User by ID
- **GET** `/api/users/:id`

#### Get User by Username
- **GET** `/api/users/username/:username`

#### Update User
- **PUT** `/api/users/:id`
- **Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com"
}
```

#### Delete User
- **DELETE** `/api/users/:id`

## Database Schema

### Password Collection
```javascript
{
  userId: String,
  password: String,
  mode: String (enum: 'basic', 'intermediate', 'advanced'),
  strength: String,
  strengthScore: Number (0-100),
  isGenerated: Boolean,
  feedback: [String],
  personalDetails: {
    firstName: String,
    lastName: String,
    birthDate: String
  },
  tags: [String],
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### User Collection
```javascript
{
  username: String,
  email: String,
  firstName: String,
  lastName: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

All endpoints return consistent error responses:
```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

## CORS Configuration

The backend is configured to accept requests from the frontend running on `http://localhost:4200`. Update the `CORS_ORIGIN` in `.env` to match your frontend URL.

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Allowed origin for CORS requests

## License

ISC
