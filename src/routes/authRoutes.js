const express = require('express');
const {
  MongoClient
} = require('mongodb');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');

const authRouter = express.Router();

function router(nav) {
  authRouter.route('/signUp')
    .post((req, res) => {
      const {
        username,
        password
      } = req.body;
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';
      let client;
      (async function addUser() {
        try {
          client = await MongoClient.connect(url, {
            useNewUrlParser: true
          });
          const db = client.db(dbName);
          const user = {
            username,
            password
          };
          const result = await db.collection('users').insertOne(user);
          debug(result);
          req.login(result.ops[0], () => { // As we login passport serialize & store the logged in user to session
            res.redirect('/auth/profile'); // When we make request to any page which require user to be logged in
          }); // it goes through passport which deserialze the user and validate    
        } catch (err) {
          debug(err);
        }
      }());
    });
  authRouter.route('/signin')
    .get((req, res) => {
      res.render('signin', {
        nav,
        title: 'Sign In'
      });
    })
    .post(passport.authenticate('local', {
      successRedirect: '/auth/profile',
      failureRedirect: '/'
    }));
  authRouter.route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        res.redirect('/auth/signin');
      }
    })
    .get((req, res) => {
      res.json(req.user); // After a user is logged in user info is available in request
    });
  return authRouter;
}

module.exports = router;