const { penguinData, historicalPosition } = require('../models/allModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const addPenguinData = async (req, res) => {
  try {
    const { penguinName, lastPosition, lastUpdate, speciesName, ageAtTagging, taggedPosition, taggedTime, taggedBy } = req.body;

    // Check if penguinName already exists
    const existingPenguin = await penguinData.findOne({ penguinName });
    if (existingPenguin) {
      return res.status(400).json({ message: 'Penguin with this name already exists' });
    }

    const penguin = new penguinData({
      penguinName,
      lastPosition,
      lastUpdate,
      speciesName,
      ageAtTagging,
      taggedPosition,
      taggedTime,
      taggedBy,
    });

    await penguin.save();

    res.status(201).json({ message: 'New penguin data added successfully - wenk wenk!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllPenguinData = async (req, res) => {
  try {
    const penguins = await penguinData.find();
    res.json(penguins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updatePenguinData = async (req, res) => {
  try {
    const { id, lastPosition } = req.body;

    const penguin = await penguinData.findOneAndUpdate(
      { _id: id },
      { lastPosition: lastPosition },
      { new: true }
    );

    if (!penguin) {
      return res.status(404).json({ message: 'Penguin not found' });
    }

    const historicalPos = new historicalPosition({
      penguinData: penguin._id,
      penguinNameRec: penguin.penguinName,
      previousPenguinPosition: [...penguin.lastPosition]
    });

    await historicalPos.save();

    res.status(200).json({ message: 'Penguin data updated successfully', penguin, historicalPositionMessage: "Historical Position of Penguin is also recorded", historicalPos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { addPenguinData, getAllPenguinData, updatePenguinData };
