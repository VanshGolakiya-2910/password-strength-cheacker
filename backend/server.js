const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { validateEnv } = require('./config/env');

// Load environment variables
dotenv.config();
let config;

try {
  config = validateEnv();
} catch (error) {
  console.error(`Environment validation failed: ${error.message}`);
  process.exit(1);
}

const app = express();

// Middleware
app.disable('x-powered-by');
app.use(helmet());
app.use(morgan(config.isProduction ? 'tiny' : 'dev'));

app.use(rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' }
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (config.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(config.mongoUri)
  .then(() => {
    if (!config.isProduction) {
      console.log('MongoDB connected');
    }
  })
  .catch((err) => {
    console.error('MongoDB connection failed');
    if (!config.isProduction) {
      console.error(err);
    }
    process.exit(1);
  });

// Routes
app.use('/api/v1/passwords', require('./routes/passwordRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/data', require('./routes/dataRoutes'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (!config.isProduction) {
    console.error(err);
  }

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'Request origin is not allowed' });
  }

  res.status(err.status || 500).json({
    message: config.isProduction ? 'Something went wrong. Please try again later.' : (err.message || 'Internal server error')
  });
});

// Start server
app.listen(config.port, () => {
  if (!config.isProduction) {
    console.log(`Server running on port ${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
  }
});

module.exports = app;
