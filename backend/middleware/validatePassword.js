// Middleware to validate password data
const validatePasswordData = (req, res, next) => {
  const { password, mode, strength, strengthScore } = req.body;

  if (!password || !mode || !strength || strengthScore === undefined) {
    return res.status(400).json({
      message: 'Missing required fields: password, mode, strength, strengthScore'
    });
  }

  const validModes = ['basic', 'intermediate', 'advanced'];
  if (!validModes.includes(mode)) {
    return res.status(400).json({
      message: `Invalid mode. Must be one of: ${validModes.join(', ')}`
    });
  }

  const validStrengths = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
  if (!validStrengths.includes(strength)) {
    return res.status(400).json({
      message: `Invalid strength. Must be one of: ${validStrengths.join(', ')}`
    });
  }

  if (strengthScore < 0 || strengthScore > 100) {
    return res.status(400).json({
      message: 'Strength score must be between 0 and 100'
    });
  }

  next();
};

module.exports = validatePasswordData;
