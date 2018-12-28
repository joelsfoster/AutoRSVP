const router = require('express-promise-router')(); // Instantiate
const NyscDataController = require('../controllers/NyscDataController');

router.route('/')
  .get(NyscDataController.index)
  .post(NyscDataController.newNyscData)

module.exports = router;
