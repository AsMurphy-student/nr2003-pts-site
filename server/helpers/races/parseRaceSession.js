const models = require('../../models');

const { Finishes } = models;

// Helper function which parses race session from table
const parseRaceSession = (table) => {
  const finishPosSchemas = [];
  const elements = table.querySelectorAll('td');

  // We start at index 9 to skip header elements
  // which are in td tags
  for (let i = 9; i < elements.length; i += 9) {
    const newFinish = new Finishes.FinishPositionModel({
      driverName: elements[i + 3].innerHTML,
      carNumber: parseInt(elements[i + 2].innerHTML, 10),
      startPos: parseInt(elements[i + 1].innerHTML, 10),
      interval: elements[i + 4].innerHTML,
      lapsLed: parseInt(elements[i + 6].innerHTML.replace(/\*$/, ''), 10),
      ledMost: elements[i + 6].innerHTML.trim().slice(-1) === '*',
      lapsCompleted: parseInt(elements[i + 5].innerHTML, 10),
      status: elements[i + 8].innerHTML,
    });
    finishPosSchemas.push(newFinish);
  }
  return finishPosSchemas;
};

module.exports = parseRaceSession;
