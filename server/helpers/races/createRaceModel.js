const { JSDOM } = require('jsdom');

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
  console.log(tableNames);
};

module.exports = createRaceModel;
