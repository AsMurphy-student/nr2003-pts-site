const mongoose = require('mongoose');
const _ = require('underscore');
const { finishPositionSchema } = require('./finishPosition');

const setName = (name) => _.escape(name).trim();

const RaceSchema = new mongoose.Schema({
  raceNumber: {
    type: Number,
    min: 1,
    required: true,
  },
  raceData: {
    type: Date,
    required: true,
  },
  finishPositions: [finishPositionSchema],
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

const ChampionshipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  races: [RaceSchema],
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

ChampionshipSchema.statics.toAPI = (doc) => ({
  name: doc.name,
});

const DomoModel = mongoose.model('Championship', ChampionshipSchema);
module.exports = DomoModel;