// JSDOM is used to get the dom structure of the race file
const { JSDOM } = require('jsdom');
const parseOtherSession = require('./parseOtherSession');
const parseRaceSession = require('./parseRaceSession');

const models = require('../../models');

const { Race } = models;

// Helper function which gets the titles of all the tables
const getTableTitles = (tables) => {
  const tableNameArray = [];
  tables.forEach((table) => {
    const prevSib = table.previousElementSibling.previousElementSibling;
    const text = prevSib.innerHTML.trim();
    // If there is a title push it
    // Else go up one more child to get title
    if (text !== '') {
      tableNameArray.push(text);
    } else {
      tableNameArray.push(table.previousElementSibling.innerHTML.trim());
    }
  });
  return tableNameArray;
};

// Helper function which returns a raceModel
const createRaceModel = (htmlString, raceNumber) => {
  // Get dom structure of html file with JSDOM
  const domOfRace = new JSDOM(htmlString);
  // Get tables and tablenames
  const tables = domOfRace.window.document.querySelectorAll('table');
  const tableNames = getTableTitles(tables);

  const trackName = domOfRace.window.document.querySelectorAll('h3')[0].innerHTML.slice(9);

  // Declare newRace RaceModel
  const newRace = new Race.RaceModel({
    raceNumber,
    trackName,
  });

  let startsArray = [];
  let finishesArray = [];

  // For each table type run helpers for sessions in race
  tables.forEach((table, index) => {
    if (tableNames[index] === 'Session: Qualifying') startsArray = parseOtherSession(table);
    else if (tableNames[index] === 'OFFICIAL STANDINGS') finishesArray = parseRaceSession(table);
  });

  // Set starts and finishes array and return newRace RaceModel
  newRace.startPositions = startsArray;
  newRace.finishPositions = finishesArray;
  return newRace;
};

module.exports = createRaceModel;
