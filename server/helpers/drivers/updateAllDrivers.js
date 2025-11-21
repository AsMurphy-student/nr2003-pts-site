const models = require('../../models');

const { Championship, Driver } = models;

// Helper Function which returns points
// Takes in car Count, the finishing position, ledMost boolean, and lapsLed
const calculatePoints = (carCount, finishPos, ledMost, lapsLed) => {
  // If led the most, add an extra 10 points
  if (ledMost) {
    return (carCount - finishPos + 1) * 5 + 10;
  }
  // If did not lead most but did lead, add 5 extra points
  if (lapsLed > 0) {
    return (carCount - finishPos + 1) * 5 + 5;
  }
  // If led none, calculate without extra points
  return (carCount - finishPos + 1) * 5;
};

// Update All Drivers Helper
// Updates all drivers with the new raceModel and specified championship query
const updateAllDrivers = async (raceModel, champQuery) => {
  // Query the championship to update
  const championshipToUpdate = await Championship.findOne(champQuery)
    .select('name totalLaps races drivers')
    .lean()
    .exec();

  // If there are no driver docs in the array
  // then create a new one for each driver
  if (championshipToUpdate.drivers.length === 0) {
    raceModel.finishPositions.forEach(async (driver, index) => {
      // Create new driver model with needed properties
      const newDriver = new Driver.DriverModel({
        // Driver Name and Car Number
        driverName: driver.driverName,
        carNumber: driver.carNumber,
        // Turnery operators to set poles, wins, top 5s, etc.
        poles: driver.startPos === 1 ? 1 : 0,
        wins: index + 1 === 1 ? 1 : 0,
        top5: index + 1 <= 5 ? 1 : 0,
        top10: index + 1 <= 10 ? 1 : 0,
        top15: index + 1 <= 15 ? 1 : 0,
        top20: index + 1 <= 20 ? 1 : 0,
        // Laps Completed, Led, DNFs (Did not finish), and Races Led
        lapsCompleted: driver.lapsCompleted,
        lapsLed: driver.lapsLed,
        dnfs: driver.status !== 'Running' ? 1 : 0,
        racesLed: driver.lapsLed > 0 ? 1 : 0,
        // Start and Finish Positions Array with Starts and Finishes Counters
        // Counter are needed as array length does not indicate a start or finish
        // If a driver does not attend a race, their start and finish position is 0
        startPositions: [driver.startPos],
        starts: 1,
        finishPositions: [index + 1],
        finishes: 1,
        // Average start and finish is populated with the one finish
        avgStart: driver.startPos,
        avgFinish: index + 1,
        // First points value is added
        pointsPerRace: [
          calculatePoints(
            raceModel.finishPositions.length,
            index + 1,
            driver.ledMost,
            driver.lapsLed,
          ),
        ],
      });

      // Push new driver to array
      await Championship.updateOne(champQuery, {
        $push: { drivers: newDriver },
      });
    });
    // Once all drivers are added, increment totalLaps by completed laps for the race
    await Championship.updateOne(champQuery, {
      $inc: { totalLaps: raceModel.finishPositions[0].lapsCompleted },
    });

    // If there are drivers in the array
    // either update current ones or add new ones
  } else {
    // Create separate reference from queried championship
    const updatedChampionship = championshipToUpdate;

    // Loop through the finishes of the race
    raceModel.finishPositions.forEach(async (driver, index) => {
      // Get the current driver in database
      const targetDriver = updatedChampionship.drivers.find(
        (dbDriver) => dbDriver.driverName === driver.driverName,
      );

      // If driver is in database
      // Update the Driver
      if (targetDriver) {
        // This section gets the sums of starts and finishes
        // and then adds the newest one
        // This is to calculate the averages
        // I tried to use reduce functions for conciseness
        // however I was having issues
        // may refactor if time allows
        let startSum = 0;
        for (let s = 0; s < targetDriver.startPositions.length; s++) {
          startSum += targetDriver.startPositions[s];
        }
        startSum += driver.startPos;

        let finishSum = 0;
        for (let f = 0; f < targetDriver.finishPositions.length; f++) {
          finishSum += targetDriver.finishPositions[f];
        }
        finishSum += index + 1;

        // Created new updatedDriver object to replace old object
        const updatedDriver = {
          // Spread current properties
          ...targetDriver,
          // Update properties we need to update
          poles: targetDriver.poles + (driver.startPos === 1 ? 1 : 0),
          wins: targetDriver.wins + (index + 1 === 1 ? 1 : 0),
          top5: targetDriver.top5 + (index + 1 <= 5 ? 1 : 0),
          top10: targetDriver.top10 + (index + 1 <= 10 ? 1 : 0),
          top15: targetDriver.top15 + (index + 1 <= 15 ? 1 : 0),
          top20: targetDriver.top20 + (index + 1 <= 20 ? 1 : 0),
          lapsCompleted: targetDriver.lapsCompleted + driver.lapsCompleted,
          lapsLed: targetDriver.lapsLed + driver.lapsLed,
          dnfs: targetDriver.dnfs + (driver.status !== 'Running' ? 1 : 0),
          racesLed: targetDriver.racesLed + (driver.lapsLed > 0 ? 1 : 0),
          startPositions: [...targetDriver.startPositions, driver.startPos],
          starts: targetDriver.starts + 1,
          finishPositions: [...targetDriver.finishPositions, index + 1],
          finishes: targetDriver.finishes + 1,
          // Parse floats on averages and round to 2 decimals
          avgStart: parseFloat(
            (startSum / (targetDriver.starts + 1.0)).toFixed(2),
          ),
          avgFinish: parseFloat(
            (finishSum / (targetDriver.finishes + 1.0)).toFixed(2),
          ),
          pointsPerRace: [
            ...targetDriver.pointsPerRace,
            targetDriver.pointsPerRace[targetDriver.pointsPerRace.length - 1]
              + calculatePoints(
                raceModel.finishPositions.length,
                index + 1,
                driver.ledMost,
                driver.lapsLed,
              ),
          ],
        };

        // Replace in updatedChampionship object the current driver
        updatedChampionship.drivers[
          updatedChampionship.drivers.indexOf(targetDriver)
        ] = updatedDriver;

        // If driver does not exist
      } else {
        // Fill start, finishes, and pointsPerRace arrays with 0s
        // to indicate driver did not attend those races
        const startPosArray = new Array(raceModel.raceNumber - 1).fill(0);
        startPosArray.push(driver.startPos);
        const finishPosArray = new Array(raceModel.raceNumber - 1).fill(0);
        finishPosArray.push(index + 1);
        const pointsArray = new Array(raceModel.raceNumber - 1).fill(0);
        pointsArray.push(
          calculatePoints(
            raceModel.finishPositions.length,
            index + 1,
            driver.ledMost,
            driver.lapsLed,
          ),
        );

        // Create new driver model with properties
        const newDriver = new Driver.DriverModel({
          driverName: driver.driverName,
          carNumber: driver.carNumber,
          poles: driver.startPos === 1 ? 1 : 0,
          wins: index + 1 === 1 ? 1 : 0,
          top5: index + 1 <= 5 ? 1 : 0,
          top10: index + 1 <= 10 ? 1 : 0,
          top15: index + 1 <= 15 ? 1 : 0,
          top20: index + 1 <= 20 ? 1 : 0,
          lapsCompleted: driver.lapsCompleted,
          lapsLed: driver.lapsLed,
          dnfs: driver.status !== 'Running' ? 1 : 0,
          racesLed: driver.lapsLed > 0 ? 1 : 0,
          startPositions: startPosArray,
          starts: 1,
          finishPositions: finishPosArray,
          finishes: 1,
          avgStart: driver.startPos,
          avgFinish: index + 1,
          pointsPerRace: pointsArray,
        });

        // Push to updatedChampionship driver array
        updatedChampionship.drivers.push(newDriver);
      }
    });

    // Iterate through to add 0s to starts and finishes arrays
    // for drivers that did not attend
    // and carry over their current points
    updatedChampionship.drivers.forEach((driver) => {
      if (
        driver.startPositions.length < raceModel.raceNumber
        || driver.startPositions.length < raceModel.raceNumber
      ) {
        driver.startPositions.push(0);
        driver.finishPositions.push(0);
        driver.pointsPerRace.push(
          driver.pointsPerRace[driver.pointsPerRace.length - 1],
        );
      }
    });

    // Increment laps completed for the championship with newest race laps
    updatedChampionship.totalLaps += raceModel.finishPositions[0].lapsCompleted;

    // Update current championship with modified new one
    await Championship.updateOne(
      { _id: updatedChampionship._id },
      { $set: updatedChampionship },
    );
    // Old console logs for testing that can be useful if bugs arise
    // .then(() => console.log('Championship updated!'))
    // .catch((err) => {
    //   console.error('Error updating championship:', err);
    // });
  }
};

module.exports = updateAllDrivers;
