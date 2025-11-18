const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema(
  {
    driverName: {
      type: String,
      required: true,
    },
    carNumber: {
      type: Number,
      min: 0,
      required: true,
    },
    poles: {
      type: Number,
      min: 0,
      required: true,
    },
    wins: {
      type: Number,
      min: 0,
      required: true,
    },
    top5: {
      type: Number,
      min: 0,
      required: true,
    },
    top10: {
      type: Number,
      min: 0,
      required: true,
    },
    top15: {
      type: Number,
      min: 0,
      required: true,
    },
    top20: {
      type: Number,
      min: 0,
      required: true,
    },
    lapsCompleted: {
      type: Number,
      min: 0,
      required: true,
    },
    lapsLed: {
      type: Number,
      min: 0,
      required: true,
    },
    dnfs: {
      type: Number,
      min: 0,
      required: true,
    },
    racesLed: {
      type: Number,
      min: 0,
      required: true,
    },
    startPositions: {
      type: [Number],
      required: true,
    },
    starts: {
      type: Number,
      required: true,
    },
    finishPositions: {
      type: [Number],
      required: true,
    },
    finishes: {
      type: Number,
      required: true,
    },
    avgStart: {
      type: Number,
      min: 0,
      required: true,
    },
    avgFinish: {
      type: Number,
      min: 0,
      required: true,
    },
    pointsPerRace: {
      type: [Number],
      required: true,
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
  },
  { autoCreate: false },
);

DriverSchema.statics.toAPI = (doc) => ({
  raceNumber: doc.raceNumber,
});

const DriverModel = mongoose.model('Driver', DriverSchema);
module.exports = {
  DriverModel,
  DriverSchema,
};
