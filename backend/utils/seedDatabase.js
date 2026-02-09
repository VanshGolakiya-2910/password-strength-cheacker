// Sample data generator for testing
const Password = require('../models/Password');
const User = require('../models/User');

const samplePasswords = [
  {
    password: 'SecureP@ss123',
    mode: 'basic',
    strength: 'Very Strong',
    strengthScore: 90,
    isGenerated: false,
    feedback: ['Strong password'],
    tags: ['work'],
    notes: 'Main work password'
  },
  {
    password: 'MyP@ssw0rd',
    mode: 'intermediate',
    strength: 'Strong',
    strengthScore: 75,
    isGenerated: false,
    feedback: ['Good length', 'Contains special character'],
    tags: ['personal'],
    notes: 'Personal account'
  },
  {
    password: 'Test@123',
    mode: 'basic',
    strength: 'Medium',
    strengthScore: 50,
    isGenerated: false,
    feedback: ['Password is too short'],
    tags: ['test'],
    notes: 'Test password'
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Password.deleteMany({});
    await User.deleteMany({});

    // Create sample users
    const users = await User.insertMany([
      {
        username: 'johndoe',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe'
      },
      {
        username: 'janedoe',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Doe'
      }
    ]);

    console.log(`${users.length} users created`);

    // Create sample passwords for each user
    const passwordsToInsert = [];
    users.forEach(user => {
      samplePasswords.forEach(pwd => {
        passwordsToInsert.push({
          ...pwd,
          userId: user._id.toString()
        });
      });
    });

    const passwords = await Password.insertMany(passwordsToInsert);
    console.log(`${passwords.length} passwords created`);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;
