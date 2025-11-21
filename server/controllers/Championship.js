const models = require('../models');
const createRaceModel = require('../helpers/races/createRaceModel');
const updateAllDrivers = require('../helpers/drivers/updateAllDrivers');

const { Championship } = models;

// Renders the Championships view
// This lists out the different championships which the user has created
const championshipsPage = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Championship.find(query).select('name').lean().exec();

    return res.render('championships', { championships: docs });
  } catch (err) {
    return res.status(500).json({ error: `Error retrieving championships: ${err}` });
  }
};

// Renders the championship overview page
// This shows current statistics after the latest race
const championshipOverviewPage = async (req, res) => res.render('championship_overview');

const getChampionshipData = async (req, res) => {
  try {
    const query = { owner: req.session.account._id, name: req.params.name };
    const championshipData = await Championship.findOne(query)
      .select('name races drivers')
      .lean()
      .exec();

    championshipData.drivers.sort(
      (a, b) => b.pointsPerRace[b.pointsPerRace.length - 1]
        - a.pointsPerRace[a.pointsPerRace.length - 1],
    );

    if (!championshipData) return res.status(500).json({ error: 'Invalid championship name!' });
    return res.json({ championshipData });
  } catch (err) {
    return res.status(500).json({ error: `Something went wrong: ${err}` });
  }
};

// This is the add race post endpoint
// This allows the user to upload a new race file to be parsed
// This creates both a new race file and updates/adds driver docs
const addRace = async (req, res) => {
  try {
    // Query championship doc that will be updated
    const query = { owner: req.session.account._id, name: req.body.name };
    const championshipToAddTo = await Championship.findOne(query)
      .select('name races drivers')
      .lean()
      .exec();

    // Determine new race number
    const newRaceNumber = championshipToAddTo.races ? championshipToAddTo.races.length + 1 : 1;

    // Create html string to parse
    const fileBuffer = req.files.raceFile;
    const fileString = fileBuffer.data.toString('utf8');

    // Create new race doc
    const newRace = createRaceModel(fileString, newRaceNumber);

    // Push new race doc to championship
    await Championship.updateOne(query, {
      $push: { races: newRace },
    });

    // Create or update driver docs
    await updateAllDrivers(newRace, query);

    // Redirect to overview page after updating
    return res.json({ redirect: `/championships/${championshipToAddTo.name}` });
  } catch (err) {
    return res.status(500).json({ error: `Error retrieving championship or parsing file: ${err}` });
  }
};

// Post request to create new championship
const makeChampionship = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Championship name is required!' });
  }

  // Initialize required data
  const championshipData = {
    name: req.body.name,
    totalLaps: 0,
    owner: req.session.account._id,
  };

  try {
    // Save championship and reload page
    const newChampionship = new Championship(championshipData);
    await newChampionship.save();
    return res.json({ redirect: '/championships' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Championship already exists!' });
    }
    return res
      .status(500)
      .json({ error: `An error occured making championship: ${err}` });
  }
};

module.exports = {
  championshipsPage,
  championshipOverviewPage,
  getChampionshipData,
  makeChampionship,
  addRace,
};
