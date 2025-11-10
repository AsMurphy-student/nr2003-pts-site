const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const RaceSchema = new mongoose.Schema({
  raceNumber: {
    type: Number,
    min: 1,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Championship',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

RaceSchema.statics.toAPI = (doc) => ({
  raceNumber: doc.raceNumber,
});

const DomoModel = mongoose.model('Race', RaceSchema);
module.exports = DomoModel;