const User = require('../models/User');

const getUser = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'email query required' });
    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    // return hashed password for debugging only
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'debug failed', error: err.message });
  }
};

module.exports = { getUser };
