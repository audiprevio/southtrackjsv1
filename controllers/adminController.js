// adminController.js
const jwt = require('jsonwebtoken');
const { adminData } = require('../models/allModel'); // Import your models
const bcrypt = require('bcrypt');
require('dotenv').config();

const createAdmin = async (req, res) => {
  try {
    const { username, employeeId, password, role } = req.body;

    // Check if username or employeeId already exists
    const existingAdmin = await adminData.findOne({ $or: [{ username }, { employeeId }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this username or employeeId already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new adminData({
      username,
      employeeId,
      password: hashedPassword,
      role
    });

    await admin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error(error); // Log the detailed error to the console
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getAdmin = async (req, res) => {
  try {
    const admins = await adminData.find({ is_deleted: { $ne: true }});
    res.json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const softDeleteAdmin = async (req, res) => {
  try {
    const { _id } = req.body;
    console.log('Soft delete ID:', _id); // Log the ID to check if it matches the expected format

    const admin = await adminData.findByIdAndUpdate(_id, { $set: { is_deleted: true } }, { new: true });
    console.log('Found admin:', admin); // Log the admin object to check if it's null or contains the admin

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.json({ message: 'Admin soft deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAdminPassword = async (req, res) => {
  try {
    const { _id, password } = req.body;
    const admin = await adminData.findById(_id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Check if the new password is the same as the old one
    const isSamePassword = await bcrypt.compare(password, admin.password);
    if (isSamePassword) {
      return res.status(400).json({ message: 'New password cannot be the same as the old one' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: 'Admin password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await adminData.findOne({ username });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ _id: admin._id.toString(), role: admin.role }, "yandhi2024");
    res.json({ token, message: 'Logged in successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports = { createAdmin, getAdmin, updateAdminPassword, softDeleteAdmin, loginAdmin };