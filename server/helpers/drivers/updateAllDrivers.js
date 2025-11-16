const mongoose = require('mongoose');

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

  try {
    await Driver.DriverModel.updateOne(
      { _id: new mongoose.Types.ObjectId('691a459a3083dfb83bfb7735') },
      { $set: { lapsCompleted: 0 } },
    ).then((result) => console.log(`Updated ${JSON.stringify(result)} document(s)`));
  } catch (err) {
    console.error('Error updating driver:', err);
  }
  // try {
  //   const doc = await Driver.DriverModel.findById('691a459a3083dfb83bfb7735');
  //   if (!doc) {
  //     console.error(`Document not found: _id=${'691a459a3083dfb83bfb7735'}`);
  //   } else {
  //     console.log(`Found document: ${JSON.stringify(doc, null, 2)}`);
  //   }
  // } catch (err) {
  //   console.error('Error retrieving document:', err);
  // }

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
    const updatedChampionship = championshipToUpdate;

    raceModel.finishPositions.forEach(async (driver, index) => {
      const targetDriver = updatedChampionship.drivers.find(
        (dbDriver) => dbDriver.driverName === driver.driverName,
      );
      // console.log(targetDriver.driverName);

      if (targetDriver) {
        const updates = { $set: {} };

        // updates.$set.lapsCompleted =
        //   targetDriver.lapsCompleted + driver.lapsCompleted;
        // updates.$set.lapsLed = targetDriver.lapsLed + driver.lapsLed;

        // const didDnf = driver.status !== 'Running';
        // updates.$set.dnfs = targetDriver.dnfs + (didDnf ? 1 : 0);
        // updates.$set.racesLed =
        //   targetDriver.racesLed + (driver.lapsLed > 0 ? 1 : 0);

        // updates.$set.startPositions = [
        //   ...targetDriver.startPositions,
        //   driver.startPos,
        // ];
        // updates.$set.starts = targetDriver.starts + 1;

        // updates.$set.finishPositions = [
        //   ...targetDriver.finishPositions,
        //   index + 1,
        // ];
        // updates.$set.finishes = targetDriver.finishes + 1;

        // updates.$set.pointsPerRace = [
        //   ...targetDriver.pointsPerRace,
        //   calculatePoints(raceModel.finishPositions.length, index + 1, driver),
        // ];
        updates.$set.lapsCompleted = 0;

        // console.log(updates);

        await Driver.DriverModel.updateOne({ _id: targetDriver._id }, updates, {
          upsert: false,
        })
          .then((result) => {
            // console.log(
            //   `Updated ${targetDriver.driverName} with result`,
            //   result,
            // );
          })
          .catch((error) => {
            // console.error('Error updating driver:', error);
          });
      } else {
        const startPosArray = new Array(raceModel.raceNumber - 1).fill(0);
        startPosArray.push(driver.startPos);
        const finishPosArray = new Array(raceModel.raceNumber - 1).fill(0);
        finishPosArray.push(index + 1);
        const pointsArray = new Array(raceModel.raceNumber - 1).fill(0);
        pointsArray.push(
          calculatePoints(raceModel.finishPositions.length, index + 1, driver),
        );

        const newDriver = new Driver.DriverModel({
          driverName: driver.driverName,
          carNumber: driver.carNumber,
          lapsCompleted: driver.lapsCompleted,
          lapsLed: driver.lapsLed,
          dnfs: driver.status !== 'Running' ? 1 : 0,
          racesLed: driver.lapsLed > 0 ? 1 : 0,
          startPositions: startPosArray,
          starts: 1,
          finishPositions: finishPosArray,
          finishes: 1,
          pointsPerRace: pointsArray,
        });
        // updatedChampionship.drivers.push(newDriver);
        // await Championship.updateOne(champQuery, {
        // $push: { drivers: newDriver },
        // });
        // console.log(newDriver);
      }
    });
  }
};

module.exports = updateAllDrivers;
