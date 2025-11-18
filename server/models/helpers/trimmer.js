const trimDriverName = (driver) => driver.replace(/(\r\n|\n|\r)/g, '').replaceAll('\t', '');

module.exports = trimDriverName;
