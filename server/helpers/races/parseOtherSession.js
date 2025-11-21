const models = require('../../models');

const { Starts } = models;

// Helper function which processes a non-race session
// These can be practice, qualifying, or happy hour
const parseOtherSession = (table) => {
  const startPosSchemas = [];
  const elements = table.querySelectorAll('td');
  // We start at 4 to skip header elements as they are in td tags
  for (let i = 4; i < elements.length; i += 4) {
    const speedStr = elements[i + 3].innerHTML;
    const newQuali = new Starts.StartPositionModel({
      driverName: elements[i + 2].innerHTML,
      carNumber: parseInt(elements[i + 1].innerHTML, 10),
      // We slice the ' mph' off and parse as float
      speed: parseFloat(speedStr.slice(0, -4)),
    });
    startPosSchemas.push(newQuali);
  }
  return startPosSchemas;
};

module.exports = parseOtherSession;
