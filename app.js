const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const nyscDataRouter = require('./routes/nyscData');

const startCrons = require('./crons/nysc');
const NyscData = require('./models/NyscData'); // Previously got data from './data.js'


// Middleware
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1/nyscData', nyscDataRouter);

// Connect to the DB on MLab
mongoose.connect('mongodb://admin:adminpass3@ds135983.mlab.com:35983/auto-rsvp', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  // we're connected!
});

// Export the app
module.exports = app;

// Start the crons
NyscData.find( (err, nyscData) => {
  if (err) return console.error('ERROR STARTING CRON:\n' + err);
  startCrons(nyscData);
});
