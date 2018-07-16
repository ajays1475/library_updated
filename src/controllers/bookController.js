const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookController');

function bookController(bookService, nav) {
  function getIndex(req, res) {
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';
    (async function mongo() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected Successfuly to server');

        const db = client.db(dbName);

        const col = await db.collection('books');
        
        const books = await col.find().toArray();

        res.render(
          'bookListView', {
            nav,
            title: 'Books',
            books
          }
        );
      } catch (err) {
        debug(err.stack);
      }
    }());
  }

  function getById(req, res) {
    const { id } = req.params;
    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';
    (async function query() {
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected Successfuly to server');

        const db = client.db(dbName);

        const col = await db.collection('books');

        const book = await col.findOne({ _id: new ObjectID(id) });

        book.details = await bookService.getBookById(book.bookId);

        res.render('bookView', {
          nav,
          title: 'Book',
          book
        });
      } catch (err) {
        debug(err.stack);
      }
    }());
  }

  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/auth/signin');
    }
  }

  return {
    getIndex,
    getById,
    middleware
  };
}

module.exports = bookController;