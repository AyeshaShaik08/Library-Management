const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Book = require('../models/Book');

const seed = async () => {
  await connectDB();
  await User.deleteMany({});
  await Book.deleteMany({});

  const hashed = await bcrypt.hash('admin123', 10);
  const admin = await User.create({ name: 'Admin', email: 'admin@example.com', password: hashed, role: 'admin' });

  await Book.create([
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fantasy', isbn: '9780007118359', quantity: 3, availableQuantity: 3 },
    { title: '1984', author: 'George Orwell', category: 'Dystopia', isbn: '9780451524935', quantity: 5, availableQuantity: 5 },
  ]);

  console.log('Seeding complete');
  process.exit(0);
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
