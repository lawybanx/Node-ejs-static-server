const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Bring in User Model
const User = require('../models/user.model');

module.exports = (passport) => {
  // Local Strategy
  passport.use(
    new LocalStrategy((username, password, done) => {
      // Match Username
      const query = { username };
      User.findOne(query, (err, user) => {
        if (err) throw err;
        if (!user) {
          return done(null, false, { message: 'User not Found.' });
        }

        // Match Password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Wrong password.' });
          }
        });
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
