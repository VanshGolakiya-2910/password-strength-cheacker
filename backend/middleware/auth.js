const jwt = require('jsonwebtoken');

const getTokenFromCookie = (req) => {
  const cookieHeader = req.headers.cookie || '';
  const cookies = cookieHeader.split(';').map(c => c.trim());
  
  for (let cookie of cookies) {
    if (cookie.startsWith('psc_token=')) {
      return cookie.substring('psc_token='.length);
    }
  }
  return null;
};

const authMiddleware = (req, res, next) => {
  const token = getTokenFromCookie(req);
  if (!token) {
    return res.status(401).json({ message: 'Missing authorization token' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;