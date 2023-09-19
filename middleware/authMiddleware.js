// authMiddleware.js
const jwt = require('jsonwebtoken');
const { adminData } = require('../models/allModel'); // Import your models
require('dotenv').config();

const authMiddlewareFunc = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await adminData.findById(decoded._id);

    if (!admin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid JWT bearer token' });
    }

    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = authMiddlewareFunc;
