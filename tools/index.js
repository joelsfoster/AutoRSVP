const NyscData = require('../models/NyscData');

// Export the below
module.exports = exports;

exports.wipeData = async () => {
  await NyscData.deleteMany({});
}

exports.seedData = async (data) => {
  await NyscData.insertMany(data);
}
