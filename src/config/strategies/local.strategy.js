const passport = require('passport');
const {
  Strategy
} = require('passport-local');
const {
  MongoClient
} = require('mongodb');

module.exports = function localStrategy() {
  passport.use(new Strategy({
    usernameField: 'username',
    passwordField: 'password'
  }, (username, password, done) => {
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';
    let client;
    (async function validateUser() {
      try {
        client = await MongoClient.connect(url, {
          useNewUrlParser: true
        });
        const db = client.db(dbName);
        const user = await db.collection('users').findOne({ username });
        if (user.password === password) {
          done(null, user);
        } else {
          done(null, false);
        }
      } catch (err) {
        console.log(err.stack);
      }
      client.close();
    }());
  }));
};