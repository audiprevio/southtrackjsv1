const mongoose = require('mongoose');

const penguinDataSchema = new mongoose.Schema({
  penguinName: {
    type: String,
    required: true
  },
  lastPosition: {
    type: [Number], // Change data type to an array of numbers
    required: true
  },
  lastUpdate: {
    type: String,
    required: true
  },
  speciesName: {
    type: String,
    required: true
  },
  ageAtTagging: {
    type: String,
    required: true
  },
  taggedPosition: {
    type: String,
    required: true
  },
  taggedTime: {
    type: String,
    required: true
  },
  taggedBy: {
    type: String,
    required: true
  }
});

const adminDataSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 1
  },
  employeeId: {
    type: String,
    required: true,
    minlength: 1
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    },
  role: {
    type: String,
    enum: ['superadmin', 'developer'],
    required: true
  },
  is_deleted: { 
    type: Boolean, 
    default: false 
  }
});


const performanceDataSchema = new mongoose.Schema({
  totalPenguinTracked: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value'
    }
  },
  lastUpdated: {
    type: Date,
    required: true
  }
});


const historicalPositionSchema = new mongoose.Schema({
  penguinData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PenguinData',
    required: true
  },
  penguinNameRec: {
    type: String,
    required: true
  },
  previousPenguinPosition: {
    type: [Number],
    required: true
  }
});
const penguinData = mongoose.model('Penguin Data', penguinDataSchema);
const adminData = mongoose.model('Admin Data', adminDataSchema);
const PerformanceData = mongoose.model('PerformanceData', performanceDataSchema);
const historicalPosition = mongoose.model('Historical Position', historicalPositionSchema);

module.exports = { penguinData, adminData, PerformanceData, historicalPosition };