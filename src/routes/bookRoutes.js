const express = require('express');
const sql = require('mssql');
const debug = require('debug')('app:bookRoutes');

const bookRouter = express.Router();

function router(nav) {
  const books = [
    {
      title: 'War and Peace',
      genre: 'Historical Fiction',
      author: 'Lev Nikolayevich Tolstoy',
      read: false
    },
    {
      title: 'Les Miserables',
      genre: 'Historical Fiction',
      author: 'Victor Hugo',
      read: false
    },
    {
      title: 'The Time Machine',
      genre: 'Science and Fiction',
      author: 'H.G. Wells',
      read: false
    },
    {
      title: 'A Journey into the Center of Earth',
      genre: 'Historical Fiction',
      author: 'Jules Verne',
      read: false
    }
  ];
  
  bookRouter.route('/')
    .get((req, res) => {
      const request = new sql.Request();
      request.query('select * from Books')
        .then((result) => {
          debug(result);
          res.render(
            'bookListView', 
            {
              nav,
              title: 'Books',
              books: result.recordset
            }
          );
        })
        .catch((err) => {
          debug(err);
        });
    });
    
  bookRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      res.render('bookView', {
        nav,
        title: 'Book',
        book: books[id]
      });
    });  
  return bookRouter;
}

module.exports = router;
