const passport = require('passport');
require('./strategies/local.strategy')(); // When we signin we send information to out local strategy

module.exports = function passportConfig(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  // Store User in Session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Retrieves User from Session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};