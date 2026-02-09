# Password Strength Checker - Full Stack Application

A complete password strength checker application with Angular frontend and Node.js/Express backend with MongoDB database support.

## Project Structure

```
password-strength-cheacker/
├── frontend/                    # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── password-checker/    # Main password checker component
│   │   │   ├── services/
│   │   │   │   └── password.service.ts
│   │   │   └── app.module.ts
│   │   └── main.ts
│   └── package.json
│
└── backend/                     # Node.js/Express Backend
    ├── models/
    │   ├── User.js
    │   └── Password.js
    ├── controllers/
    │   ├── passwordController.js
    │   └── userController.js
    ├── routes/
    │   ├── passwordRoutes.js
    │   ├── userRoutes.js
    │   └── dataRoutes.js
    ├── middleware/
    │   └── validatePassword.js
    ├── utils/
    │   └── seedDatabase.js
    ├── server.js
    ├── package.json
    ├── .env.example
    └── README.md
```

## Features

### Frontend Features
- **Three Password Checking Modes**: Basic, Intermediate, Advanced
- **Password Generation**: Create strong passwords with guaranteed complexity
- **Real-time Strength Meter**: Visual feedback with color-coded strength levels
- **Advanced Mode**: Checks against personal details for better security evaluation
- **Password Storage**: Save passwords to backend database
- **Saved Passwords View**: Browse, search, tag, and delete saved passwords
- **Responsive UI**: Built with Bootstrap 5

### Backend Features
- **User Management**: Create and manage user accounts
- **Password Storage**: Securely store password checks with metadata
- **Statistics & Analytics**: Get insights on password strength distribution
- **Search & Filter**: Find saved passwords by tags, notes, or strength
- **Data Export/Import**: Export and import password records as JSON
- **RESTful API**: Clean and well-documented API endpoints
- **CORS Support**: Frontend-backend communication ready

## Installation & Setup

### Prerequisites
- Node.js 14.x or higher
- MongoDB 4.4 or higher
- npm or yarn
- Angular CLI (optional)

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

4. **Edit `.env` file with your MongoDB connection**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/password-strength-checker
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
```

5. **Start MongoDB** (if running locally)
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

6. **Start the backend server**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

Frontend will run on `http://localhost:4200`

4. **Build for production**
```bash
npm run build
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
The API currently uses a simple user ID system. In production, implement JWT authentication.

### Core Endpoints

#### Password Management
- `POST /passwords` - Save a new password
- `GET /passwords/user/:userId` - Get all passwords for a user
- `GET /passwords/user/:userId/stats` - Get password statistics
- `GET /passwords/user/:userId/search?query=work` - Search passwords
- `GET /passwords/:id` - Get specific password
- `PUT /passwords/:id` - Update password notes/tags
- `DELETE /passwords/:id` - Delete password
- `DELETE /passwords/user/:userId/all` - Delete all user passwords

#### User Management
- `POST /users` - Create new user
- `GET /users` - Get all users (paginated)
- `GET /users/:id` - Get user by ID
- `GET /users/username/:username` - Get user by username
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

#### Data Management
- `POST /data/export` - Export passwords as JSON
- `POST /data/import` - Import passwords from JSON

## Usage Examples

### Save a Password

**Request:**
```bash
curl -X POST http://localhost:5000/api/passwords \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "password": "SecureP@ss123",
    "mode": "basic",
    "strength": "Very Strong",
    "strengthScore": 90,
    "isGenerated": false,
    "feedback": ["Strong password"],
    "tags": ["work", "important"],
    "notes": "Main work password"
  }'
```

**Response:**
```json
{
  "message": "Password saved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "user123",
    "password": "SecureP@ss123",
    "mode": "basic",
    "strength": "Very Strong",
    "strengthScore": 90,
    "isGenerated": false,
    "feedback": ["Strong password"],
    "tags": ["work", "important"],
    "notes": "Main work password",
    "createdAt": "2024-02-09T10:30:00.000Z",
    "updatedAt": "2024-02-09T10:30:00.000Z"
  }
}
```

### Get Password Statistics

**Request:**
```bash
curl http://localhost:5000/api/passwords/user/user123/stats
```

**Response:**
```json
{
  "message": "Password statistics retrieved successfully",
  "data": {
    "totalPasswords": 5,
    "generatedPasswords": 2,
    "averageStrengthScore": 76,
    "strengthDistribution": {
      "Very Strong": 3,
      "Strong": 2
    },
    "modeDistribution": {
      "basic": 3,
      "advanced": 2
    }
  }
}
```

## Workflow

### User Journey

1. **User enters password checker app**
   - Frontend loads at `http://localhost:4200`
   - User can check passwords in Basic, Intermediate, or Advanced mode

2. **User checks a password**
   - Password strength is evaluated
   - Feedback is provided
   - User can click "Save Password" button

3. **User saves password**
   - Dialog opens to add optional notes and tags
   - Password data is sent to backend
   - Backend stores in MongoDB
   - User can now view saved passwords

4. **User views saved passwords**
   - Click "View Saved" button
   - List of all saved passwords loads
   - User can delete individual passwords
   - User can search by tags or strength

## Database Schema

### Password Collection
```javascript
{
  _id: ObjectId,
  userId: String,
  password: String,
  mode: String,           // 'basic', 'intermediate', 'advanced'
  strength: String,       // 'Very Weak' to 'Very Strong'
  strengthScore: Number,  // 0-100
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
  _id: ObjectId,
  username: String,
  email: String,
  firstName: String,
  lastName: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

All API endpoints return structured error responses:

```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Security Considerations

⚠️ **For Production Use:**

1. **Add Authentication**
   - Implement JWT tokens
   - Add user login/registration

2. **Encrypt Passwords**
   - Use bcrypt to hash passwords before storage
   - Never store plain-text passwords

3. **HTTPS**
   - Always use HTTPS in production
   - Set secure cookies

4. **Rate Limiting**
   - Implement rate limiting on API endpoints
   - Protect against brute force attacks

5. **Input Validation**
   - Validate all user inputs
   - Sanitize data before storage

6. **Environment Variables**
   - Keep sensitive data in .env files
   - Never commit .env to git

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running. Start with `mongod` or Docker.

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Check `CORS_ORIGIN` in backend `.env` matches your frontend URL.

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change PORT in `.env` or kill process: `lsof -ti:5000 | xargs kill -9`

## Performance Tips

- **Pagination**: Use limit and skip parameters for large datasets
- **Indexing**: Database has automatic indexing on userId and createdAt
- **Caching**: Consider implementing Redis for frequently accessed data
- **Lazy Loading**: Load saved passwords on demand in frontend

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC

## Support

For issues, questions, or suggestions, please open an issue in the repository.
