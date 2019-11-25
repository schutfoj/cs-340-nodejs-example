// Twit: Database Implementation
// CS 340 - Oregon State University
//
// This file contains a modification Twit exercise used for homework 
// assignments in CS 290. This implementation uses a MySQL database to store 
// Twits rather than a JSON file or the server sessions.

const express = require('express');
const exphbs = require('express-handlebars');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { info, error } = require('./log');
const path = require('path');

const app = express();

// Configure handlebars
//
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs'
});

// Configure the views
//
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(path.basename(__dirname), 'views'));

// Setup static content serving
//
app.use(express.static(path.join(path.basename(__dirname), 'public')));

// Create a database connection for a request
//
const config = require('./config');
function connectDb(req, res, next) {
  info('Connecting to the database');
  let connection = mysql.createConnection(config);
  connection.connect();
  req.db = connection;
  info('Database connected');
  next();
}

// Fetch all of the twits from our database.
//
app.get(['/', '/index.html', '/twits'], connectDb, function(req, res, next) {
  info('Rendering all the twits');
  req.db.query('SELECT * FROM twit ORDER BY date_created,id', function(
    err,
    twits
  ) {
    if (err) return next(err);
    res.render('home', { twits, withCreateModal: true });
    close(req);
  });
});

// Fetch a single twit with the ID provided in the URL from our database.
//
app.get('/twits/:id', connectDb, function(req, res, next) {
  let id = req.params.id;
  info(`Rendering single twit with id ${id}`);
  req.db.query('SELECT * FROM twit WHERE id = ?', [id], function(err, twits) {
    if (err) return next(err);
    if (twits.length === 0) {
      info(`Twit with id ${id} not found`);
      res.render('404');
    } else {
      res.render('home', { twits, withCreateModal: false });
    }
    close(req);
  });
});

// Add a a new Twit to the database with information provided in the body of 
// the HTTP request. On a successful insert, we will show the home page again.
//
app.post(
  '/twits',
  bodyParser.urlencoded({ extended: false }),
  connectDb,
  function(req, res, next) {
    info('Creating new twit');
    let id = Math.floor(Math.random() * 1000);
    let dateCreated = new Date();
    let params = [id, req.body.author, req.body.content, dateCreated];
    req.db.query(
      'INSERT INTO twit (id, author, text, date_created) VALUES (?,?,?,?)',
      params,
      function(err) {
        if (err) return next(err);
        info(`Created new twit with id ${id}`);
        res.redirect('/');
        close(req);
      }
    );
  }
);

// Handle any other requests by returning a 404 (NOT_FOUND) error.
//
app.get('*', function(req, res) {
  info('404 at ' + req.url);
  res.render('404');
});

// Handle all of the resources we need to clean up. In this case, we just need 
// to close the database connection
//
function close(req) {
  if (req.db) {
    req.db.end();
    req.db = undefined;
    info('Database connection closed');
  }
}

// Setup error handling to render a page displaying the 500 
// (INTERNAL_SERVER_ERROR) error code.
//
app.use(function(err, req, res, next) {
  if (res.headersSent) {
    next(err);
  }
  error(`500 at ${req.url}: ${err.message}`);
  res.render('500');
  close(req);
});

// Capture the port configuration for the server. We use the PORT environment 
// variable's value, but if it is not set, we will default to port 3000.
//
const port = process.env.PORT || 3000;

// Start the server
//
app.listen(port, function() {
  console.log('== Server is listening on port', port);
});
