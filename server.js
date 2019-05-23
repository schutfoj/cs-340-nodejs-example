/*
 * Write your routing code in this file.  Make sure to add your name and
 * @oregonstate.edu email address below.
 *
 * Name: Braden Hitchcock
 * Email: hitchcob@oregonstate.edu
 */

const express = require('express');
const exphbs = require('express-handlebars');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Configure handlebars
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs'
});

// Configure the views
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Caching the twits
let twits = null;
function checkCache(req, res, next) {
  if (twits) {
    next();
  } else {
    console.log('Twits not cached. Fetching twits and caching...');
    fs.readFile('./twitData.json', 'utf8', function(err, text) {
      if (err) {
        console.log(err);
        return res.status(500).end();
      }
      twits = JSON.parse(text);
      next();
    });
  }
}

app.get(['/', '/index.html'], checkCache, (req, res) => {
  res.render('home', { twits, withCreateModal: true });
});

app.get('/twits/:id', checkCache, function(req, res) {
  let id = req.params.id;
  if (id >= 0 && id < twits.length) {
    res.render('home', { twits: [twits[id]], withCreateModal: false });
  } else {
    console.log('404 ' + req.url);
    res.render('404');
  }
});

// Setup static content serving
app.use(express.static('public'));

app.get('*', function(req, res) {
  console.log('404 ' + req.url);
  res.render('404');
});

app.listen(port, function() {
  console.log('== Server is listening on port', port);
});
