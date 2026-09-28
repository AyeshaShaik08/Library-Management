const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Book = require('../models/Book');

const seed = async (req, res) => {
  try {
    // create admin if not exists
    const adminEmail = 'admin@example.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashed = await bcrypt.hash('admin123', 10);
      admin = await User.create({ name: 'Admin', email: adminEmail, password: hashed, role: 'admin' });
    }

    // create sample books if none exist
    const existing = await Book.findOne();
    if (!existing) {
      await Book.create([
        { title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fantasy', isbn: '9780007118359', quantity: 3, availableQuantity: 3 },
        { title: '1984', author: 'George Orwell', category: 'Dystopia', isbn: '9780451524935', quantity: 5, availableQuantity: 5 },
      ]);
    }

    res.json({ message: 'Seed completed', admin: { email: admin.email, password: 'admin123' } });
  } catch (err) {
    res.status(500).json({ message: 'Seed failed', error: err.message });
  }
};

module.exports = { seed };
