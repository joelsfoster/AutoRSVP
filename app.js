const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const startCrons = require('./crons/nysc');
const NyscData = require('./models/NyscData'); // Previously got data from './data.js'
const tools = require('./tools/index');

// Middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const nyscDataRouter = require('./routes/nyscData');
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
NyscData.find( async (err, nyscData) => {
  if (err) return console.error('ERROR STARTING CRON:\n' + err);

  // Uncomment these useful tools if needed
  // await tools.wipeData();
  // const data = []; // Put this data below
  // await tools.seedData(data);

  console.log('Starting crons for:\n' + nyscData);
  await startCrons(nyscData);
});
