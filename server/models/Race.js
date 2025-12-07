const mongoose = require('mongoose');
const { finishPositionSchema } = require('./finishPosition.js');
const { startPositionSchema } = require('./startPosition.js');
const trimDriverName = require('./helpers/trimmer');

// Race schema including start and finish arrays
const RaceSchema = new mongoose.Schema({
  raceNumber: {
    type: Number,
    min: 1,
    required: true,
  },
  trackName: {
    type: String,
    required: true,
    set: trimDriverName,
  },
  // Didnt have time to parse and have race Data be available
  // raceDate: {
  //   type: Date,
  //   required: true,
  // },
  startPositions: [startPositionSchema],
  finishPositions: [finishPositionSchema],
  createdDate: {
    type: Date,
    default: Date.now,
  },
}, { autoCreate: false });

RaceSchema.statics.toAPI = (doc) => ({
  raceNumber: doc.raceNumber,
});

const RaceModel = mongoose.model('Race', RaceSchema);
module.exports = {
  RaceModel,
  RaceSchema,
};
