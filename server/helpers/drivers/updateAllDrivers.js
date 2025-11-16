const models = require('../../models');

const { Championship, Driver } = models;

const calculatePoints = (carCount, finishPos, driver) => {
  if (driver.ledMost) {
    return (carCount - finishPos + 1) * 5 + 10;
  }
  if (driver.lapsLed > 0) {
    return (carCount - finishPos + 1) * 5 + 5;
  }
  return (carCount - finishPos + 1) * 5;
};

const updateAllDrivers = async (raceModel, champQuery) => {
  const championshipToUpdate = await Championship.findOne(champQuery)
    .select('name races drivers')
    .lean()
    .exec();

  // driverName
  // Car number
  // lapsCompleted
  // lapsLed
  // dnfs
  // racesLed
  // startPositions
  // starts
  // finishPositions
  // finishes
  // pointsPerRace
  if (championshipToUpdate.drivers.length === 0) {
    raceModel.finishPositions.forEach(async (driver, index) => {
      const newDriver = new Driver.DriverModel({
        driverName: driver.driverName,
        carNumber: driver.carNumber,
        lapsCompleted: driver.lapsCompleted,
        lapsLed: driver.lapsLed,
        dnfs: driver.status !== 'Running' ? 1 : 0,
        racesLed: driver.lapsLed > 0 ? 1 : 0,
        startPositions: [driver.startPos],
        starts: 1,
        finishPositions: [index + 1],
        finishes: 1,
        pointsPerRace: [
          calculatePoints(raceModel.finishPositions.length, index + 1, driver),
        ],
      });

      await Championship.updateOne(champQuery, {
        $push: { drivers: newDriver },
      });
    });
  } else {
    console.log('implement adding to drivers that exist');
  }
};

module.exports = updateAllDrivers;
