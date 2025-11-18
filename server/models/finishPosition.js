const mongoose = require('mongoose');
const trimDriverName = require('./helpers/trimmer');

const finishPositionSchema = new mongoose.Schema({
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
  startPos: {
    type: Number,
    min: 1,
    required: true,
  },
  interval: {
    type: String,
    required: true,
    set: trimDriverName,
  },
  lapsLed: {
    type: Number,
    min: 0,
    required: true,
  },
  ledMost: {
    type: Boolean,
    required: true,
  },
  lapsCompleted: {
    type: Number,
    min: 0,
    required: true,
  },
  status: {
    type: String,
    required: true,
    set: trimDriverName,
  },
  // owner: {
  //   type: mongoose.Schema.ObjectId,
  //   required: true,
  //   ref: 'Championship',
  // },
  createdDate: {
    type: Date,
    default: Date.now,
  },
}, { autoCreate: false });

const FinishPositionModel = mongoose.model('FinishPosition', finishPositionSchema);
module.exports = {
  FinishPositionModel,
  finishPositionSchema,
};
