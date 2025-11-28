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
    return res
      .status(500)
      .json({ error: `Error retrieving championships: ${err}` });
  }
};

// Renders the championship overview page
// This shows current statistics after the latest race
const championshipOverviewPage = async (req, res) => {
  req.session.championshipName = req.url.split('/').pop();
  return res.render('championship_overview');
};

const racePage = async (req, res) => {
  req.session.raceNumber = req.url.split('/').pop();
  return res.render('race_overview', { champName: req.session.championshipName });
};

const driverPage = async (req, res) => {
  req.session.driver = req.url.split('/').pop();
  return res.render('driver_overview', { champName: req.session.championshipName });
};

const getChampionshipData = async (req, res) => {
  try {
    const query = {
      owner: req.session.account._id,
      name: req.session.championshipName,
    };
    const championshipData = await Championship.findOne(query)
      .select('name races drivers')
      .lean()
      .exec();

    championshipData.drivers.sort((a, b) => {
      if (
        b.pointsPerRace[b.pointsPerRace.length - 1]
        !== a.pointsPerRace[a.pointsPerRace.length - 1]
      ) {
        return (
          b.pointsPerRace[b.pointsPerRace.length - 1]
          - a.pointsPerRace[a.pointsPerRace.length - 1]
        );
      } if (b.wins !== a.wins) {
        return b.wins - a.wins;
      } if (b.top5 !== a.top5) {
        return b.top5 - a.top5;
      } if (b.top10 !== a.top10) {
        return b.top10 - a.top10;
      } if (b.top15 !== a.top15) {
        return b.top15 - a.top15;
      } if (b.top20 !== a.top20) {
        return b.top20 - a.top20;
      } if (b.lapsLed !== a.lapsLed) {
        return b.lapsLed - a.lapsLed;
      }
      return b.lapsCompleted - a.lapsCompleted;
    });

    if (!championshipData) return res.status(500).json({ error: 'Invalid championship name!' });
    return res.json({ championshipData });
  } catch (err) {
    return res.status(500).json({ error: `Something went wrong: ${err}` });
  }
};

const getRaceData = async (req, res) => {
  try {
    const query = {
      owner: req.session.account._id,
      name: req.session.championshipName,
    };
    const championshipData = await Championship.findOne(query)
      .select('name races drivers')
      .lean()
      .exec();

    if (!championshipData) return res.status(500).json({ error: 'Invalid championship name!' });

    const race = championshipData.races[parseInt(req.session.raceNumber, 10) - 1];
    return res.json({ race });
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
    const newRaceNumber = championshipToAddTo.races
      ? championshipToAddTo.races.length + 1
      : 1;

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
    return res
      .status(500)
      .json({ error: `Error retrieving championship or parsing file: ${err}` });
  }
};

// Post request to create new championship
const makeChampionship = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Championship name is required!' });
  }

  // Initialize required data
  const championshipData = {
    name: req.body.name.replace(' ', ''),
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
  racePage,
  driverPage,
  getChampionshipData,
  makeChampionship,
  getRaceData,
  addRace,
};
