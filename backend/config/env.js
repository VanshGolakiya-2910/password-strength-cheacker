const REQUIRED_ENV_VARS = ['PORT', 'MONGODB_URI', 'JWT_SECRET', 'ALLOWED_ORIGINS'];
const ALLOWED_NODE_ENVS = ['development', 'test', 'production'];

const parseAllowedOrigins = (originsValue) => {
  return originsValue
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const validateEnv = () => {
  const missingVars = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  const nodeEnv = process.env.NODE_ENV || 'development';
  if (!ALLOWED_NODE_ENVS.includes(nodeEnv)) {
    throw new Error(`Invalid NODE_ENV value: ${nodeEnv}`);
  }

  const parsedPort = Number(process.env.PORT);
  if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
    throw new Error('PORT must be a positive integer');
  }

  const allowedOrigins = parseAllowedOrigins(process.env.ALLOWED_ORIGINS);
  if (allowedOrigins.length === 0) {
    throw new Error('ALLOWED_ORIGINS must contain at least one origin');
  }

  return {
    nodeEnv,
    isProduction: nodeEnv === 'production',
    port: parsedPort,
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    allowedOrigins,
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
    rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 200)
  };
};

module.exports = {
  validateEnv
};
