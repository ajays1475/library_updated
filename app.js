const chalk = require('chalk');
const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny')); // It is used to log the request details in console in debug mode
app.use(express.static(path.join(__dirname, 'public'))); // path to serve static css and js files
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css'))); // path to look for css files if not found in public folder
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js'))); // path to look for js files if not found in public folder
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist'))); // path to look for js files if not found in public folder
app.set('views', './src/views');
app.set('view engine', 'ejs');


const nav = [{ link: '/books', title: 'Book' },
  { link: '/authors', title: 'Author' }];
const bookRouter = require('./src/routes/bookRoutes')(nav);

app.use('/books', bookRouter);

const config = {
  user: 'sa',
  password: '123',
  server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
  port: 1433,
  database: 'Library',

  options: {
    encrypt: false // Use this if you're on Windows Azure
  }
};

sql.connect(config).catch(err => debug(err));

app.get('/', (req, res) => {
  res.render(
    'index', {
      nav: [{ link: '/books', title: 'Books' },
        { link: '/authors', title: 'Authors' }],
      title: 'Library'
    }
  );
});

app.listen(port, () => {
  debug(`listening at port ${chalk.green(port)}`);
});
