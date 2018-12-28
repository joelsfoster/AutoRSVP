const NyscData = require('../models/NyscData');

// Export the below
module.exports = exports;

exports.index = async (req, res) => {
  const nyscData = await NyscData.find({}); // Return all records
  res.status(200).json(nyscData);
}

exports.newNyscData = async (req, res) => {
  const newNyscData = new NyscData(req.body);
  nyscData = await newNyscData.save(); // Create new record
  res.status(201).json(nyscData);
}
