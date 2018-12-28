var mongoose = require('mongoose');

// Define the schema
var NyscSchema = new mongoose.Schema({
  username:  String,
  password: String,
  desiredClasses: [{
    name: String,
    startHour: String,
    startMinute: String,
    amOrPm: String,
    day: String,
    location: String
  }]
});

// Associate the schema to a MLab collection and export it for use in the controller
const NyscData = mongoose.model('nysc', NyscSchema);
module.exports = NyscData;
