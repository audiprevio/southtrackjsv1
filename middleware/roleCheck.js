const jwt = require('jsonwebtoken');
require('dotenv').config();

const roleCheck = (roles) => {
    return async (req, res, next) => {
      const admin = req.admin;
      if (!roles.includes(admin.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    };
  };
  
module.exports = roleCheck;