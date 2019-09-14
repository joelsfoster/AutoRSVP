const NyscData = require('../models/NyscData');

// Export the below
module.exports = exports;

exports.wipeData = async () => {
  await NyscData.deleteMany({});
  console.log("SUCCESS: Data wiped!");
}

exports.seedData = async (data) => {
  await NyscData.insertMany(data);
  console.log("SUCCESS: New data seeded!");
}
