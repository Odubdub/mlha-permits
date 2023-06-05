const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/access/User');

/**
 * Configure Passport authenticated session persistence.
 * @param {*} passport passport object from app.js file
 */
const configurePassport = (passport) => {
  passport.use(new LocalStrategy({ usernameField: 'idNumber' }, (idNumber, password, done) => {
    User.findOne({ idNumber }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect idNumber.' });
      if (!user.validPassword(password)) return done(null, false, { message: 'Incorrect password.' });
      return done(null, user);
    });
  }));

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}

module.exports = configurePassport;