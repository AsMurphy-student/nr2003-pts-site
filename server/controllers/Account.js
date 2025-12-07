const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

const signupPage = (req, res) => res.render('signup');

const changePasswordPage = (req, res) => res.render('changePassword', { isPremium: req.session.account.isPremium });

const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/championships' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/championships' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

// Changes password of current user then logs them out
const changePassword = async (req, res) => {
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const updatedUser = await Account.findByIdAndUpdate(
      req.session.account._id,
      { password: hash },
      { new: true },
    );
    if (!updatedUser) {
      return res.status(500).json({ error: 'An error occured!' });
    }
    return res.json({ redirect: '/logout' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

// Toggles premium mode and logs them out to update
const togglePremium = async (req, res) => {
  try {
    const updatedUser = await Account.findByIdAndUpdate(
      req.session.account._id,
      { isPremium: !req.session.account.isPremium },
      { new: true },
    );
    if (!updatedUser) {
      return res.status(500).json({ error: 'An error occured!' });
    }
    return res.json({ redirect: '/logout' });
  } catch (err) {
    return res.status(500).json({ error: 'An error occured!' });
  }
};

module.exports = {
  loginPage,
  signupPage,
  changePasswordPage,
  login,
  logout,
  signup,
  changePassword,
  togglePremium,
};
