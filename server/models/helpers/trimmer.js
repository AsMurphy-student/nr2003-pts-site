// Small function which trims the tab and new line characters
const trimDriverName = (driver) => driver.replace(/(\r\n|\n|\r)/g, '').replaceAll('\t', '');

module.exports = trimDriverName;
