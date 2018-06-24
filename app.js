const chalk = require('chalk');
const express = require('express');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny')); // It is used to log the request details in console in debug mode
app.use(express.static(path.join(__dirname, 'public'))); // path to serve static css and js files
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css'))); // path to look for css files if not found in public folder
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js'))); // path to look for js files if not found in public folder
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist'))); // path to look for js files if not found in public folder

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(port, () => {
  debug(`listening at port ${chalk.green(port)}`);
});
