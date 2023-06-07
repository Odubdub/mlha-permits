const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/access/User');
const Applicant = require('../models/applicants/applicant.model')

/**
 * Configure Passport authenticated session persistence.
 * @param {*} passport passport object from app.js file
 */
const configurePassport = (passport) => {
  passport.use('admin',new LocalStrategy({ usernameField: 'idNumber' }, (idNumber, password, done) => {
    User.findOne({ idNumber }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect idNumber.' });
      if (!user.validPassword(password)) return done(null, false, { message: 'Incorrect password.' });
      return done(null, user);
    });
  }));

  passport.use('customer', new LocalStrategy({ usernameField: 'idNo' }, (idNo, password, done) => {
    Applicant.findOne({ idNo }, (err, user) => {
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