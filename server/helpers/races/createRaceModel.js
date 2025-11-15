const { JSDOM } = require('jsdom');
const { forEach } = require('underscore');
const parseOtherSession = require('./parseOtherSession');

const getTableTitles = (tables) => {
  const tableNameArray = [];
  tables.forEach((table) => {
    const prevSib = table.previousElementSibling.previousElementSibling;
    const text = prevSib.innerHTML.trim();
    if (text !== '') {
      tableNameArray.push(text);
    } else {
      tableNameArray.push(table.previousElementSibling.innerHTML.trim());
    }
  });
  return tableNameArray;
};

const createRaceModel = (htmlString) => {
  const domOfRace = new JSDOM(htmlString);
  const tables = domOfRace.window.document.querySelectorAll('table');
  const tableNames = getTableTitles(tables);

  tables.forEach((table, index) => {
    if (tableNames[index] === 'Session: Qualifying')
      parseOtherSession(table);
    else if (tableNames[index] === 'OFFICIAL STANDINGS')
      parseRaceSession(table);
  });
};

module.exports = createRaceModel;
