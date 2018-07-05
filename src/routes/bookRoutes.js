const express = require('express');
const sql = require('mssql');
const debug = require('debug')('app:bookRoutes');

const bookRouter = express.Router();

function router(nav) {
  bookRouter.route('/')
    .get((req, res) => {
      (async function query() {
        const request = new sql.Request();
        const result = await request.query('select * from Books');
        debug(result);
        res.render(
          'bookListView', {
            nav,
            title: 'Books',
            books: result.recordset
          }
        );
      }());
    });

  bookRouter.route('/:id')
    .all((req, res, next) => {
      const { id } = req.params;
      (async function query() {
        const request = new sql.Request();
        const { recordset } = 
          await request.input('id', sql.Int, id)
            .query('select * from Books where Id = @id');
        [req.book] = recordset;
        next();
      }());
    })
    .get((req, res) => {
      res.render('bookView', {
        nav,
        title: 'Book',
        book: req.book
      });
    });
  return bookRouter;
}

module.exports = router;
