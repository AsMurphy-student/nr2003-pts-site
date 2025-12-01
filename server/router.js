const controllers = require('./controllers');

const router = (app) => {
  app.get('/login', controllers.Account.loginPage);
  app.post('/login', controllers.Account.login);

  app.get('/signup', controllers.Account.signupPage);
  app.post('/signup', controllers.Account.signup);

  app.get('/logout', controllers.Account.logout);

  app.get('/changePassword', controllers.Account.changePasswordPage);
  app.post('/changePassword', controllers.Account.changePassword);

  // app.get('/maker', controllers.Domo.makerPage);
  // app.post('/maker', controllers.Domo.makeDomo);

  app.get('/championships', controllers.Championship.championshipsPage);
  app.post('/championships', controllers.Championship.makeChampionship);

  app.get('/championships/:name', controllers.Championship.championshipOverviewPage);
  app.get('/championships/:name/race/:raceNumber', controllers.Championship.racePage);
  app.get('/championships/:name/driver/:driverName', controllers.Championship.driverPage);
  app.get('/getChampionship', controllers.Championship.getChampionshipData);
  app.get('/getRace', controllers.Championship.getRaceData);
  app.get('/getDriver', controllers.Championship.getDriverData);

  app.post('/addRace', controllers.Championship.addRace);

  app.get('/', controllers.Account.loginPage);
};

module.exports = router;
