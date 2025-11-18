const models = require('../../models');

const { Finishes } = models;

const parseRaceSession = (table) => {
  const finishPosSchemas = [];
  const elements = table.querySelectorAll('td');
  // elements.forEach((element) => {
  //   console.log(element.innerHTML);
  // });
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
