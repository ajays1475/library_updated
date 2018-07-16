const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:adminRoutes');

const adminRouter = express.Router();

const books = [{
  Id: 1,
  Title: 'Five Point Something',
  Genre: 'Education',
  Author: 'Chetan Bhagat',
  bookId: 656
},
{
  Id: 2,
  Title: 'Three Mistakes of My Life',
  Genre: 'Politics',
  Author: 'Chetan Bhagat',
  bookId: 24280
},
{
  Id: 3,
  Title: 'Two States',
  Genre: 'Love',
  Author: 'Chetan Bhagat'
}
];

function router(nav) {
  adminRouter.route('/')
    .get((req, res) => {
      (async function mongo() {
        const url = 'mongodb://localhost:27017';
        const dbName = 'libraryApp';
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected Successfuly to server');
          const db = client.db(dbName);
          const response = await db.collection('books').insertMany(books);
          res.json(response);
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });
  return adminRouter;
}

module.exports = router;