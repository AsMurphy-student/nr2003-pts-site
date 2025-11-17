const models = require('../models');
const createRaceModel = require('../helpers/races/createRaceModel');
const updateAllDrivers = require('../helpers/drivers/updateAllDrivers');

const { Championship } = models;

const championshipsPage = async (req, res) => {
  try {
    // console.log(req.session.account.championships);
    const query = { owner: req.session.account._id };
    const docs = await Championship.find(query).select('name').lean().exec();

    return res.render('championships', { championships: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving championships!' });
  }
};

const championshipOverviewPage = async (req, res) => {
  try {
    const query = { owner: req.session.account._id, name: req.params.name };
    const championshipData = await Championship.findOne(query)
      .select('name races drivers')
      .lean()
      .exec();

    championshipData.drivers.sort(
      (a, b) =>
        b.pointsPerRace[b.pointsPerRace.length - 1] -
        a.pointsPerRace[a.pointsPerRace.length - 1],
    );

    if (!championshipData)
      return res.status(500).json({ error: 'Invalid championship name!' });
    return res.render('championship_overview', championshipData);
  } catch (err) {
    return res.status(500).json({ error: 'Invalid championship name!' });
  }
};

const addRace = async (req, res) => {
  try {
    const query = { owner: req.session.account._id, name: req.body.name };
    const championshipToAddTo = await Championship.findOne(query)
      .select('name races drivers')
      .lean()
      .exec();

    // console.log(championshipToAddTo[0].races);
    let newRaceNumber = 0;
    if (championshipToAddTo.races) {
      newRaceNumber = championshipToAddTo.races.length + 1;
    } else {
      newRaceNumber = 1;
    }
    const fileBuffer = req.files.raceFile;
    const fileString = fileBuffer.data.toString('utf8');
    // console.log(fileString);

    // const htmlContent = fs.readFileSync(`${__dirname}/race.html`, 'utf8');

    // if (championshipToAddTo.races) {
    //   championshipToAddTo.races.push(createRaceModel(htmlContent, newRaceNumber));
    // } else {
    //   championshipToAddTo.races = [createRaceModel(htmlContent, newRaceNumber)];
    // }

    // await championshipToAddTo.save();

    // Remember to set back to newRaceNumber after fixing drivers updating
    const newRace = createRaceModel(fileString, newRaceNumber);

    await Championship.updateOne(query, {
      $push: { races: newRace },
    });

    updateAllDrivers(newRace, query);

    // if (prevSib && prevSib.tagName === "H3") {
    //     console.log(prevSib.textContent);
    //   } else if (prevSib && prevSib.childNodes.length > 0) {
    //     const title = prevSib.firstChild;
    //     console.log(title.textContent);
    //   }

    // return res.render('championships', { championships: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving championships!' });
  }
};

const makeChampionship = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Championship name is required!' });
  }

  const championshipData = {
    name: req.body.name,
    owner: req.session.account._id,
  };

  try {
    const newChampionship = new Championship(championshipData);
    await newChampionship.save();
    return res.json({ redirect: '/championships' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Championship already exists!' });
    }
    return res
      .status(500)
      .json({ error: 'An error occured making championship!' });
  }
};

module.exports = {
  championshipsPage,
  championshipOverviewPage,
  makeChampionship,
  addRace,
};
