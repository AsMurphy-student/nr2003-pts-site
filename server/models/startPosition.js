const mongoose = require('mongoose');
const trimDriverName = require('./helpers/trimmer');

// Start position schema which includes speed in quali
const startPositionSchema = new mongoose.Schema({
  driverName: {
    type: String,
    required: true,
    set: trimDriverName,
  },
  carNumber: {
    type: Number,
    min: 0,
    required: true,
  },
  speed: {
    type: Number,
    min: 0,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
}, { autoCreate: false });

const StartPositionModel = mongoose.model('StartPosition', startPositionSchema);
module.exports = {
  StartPositionModel,
  startPositionSchema,
};
