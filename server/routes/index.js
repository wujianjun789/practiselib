const express = require('express');
const router = express.Router();
const config = require("./config");
/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.json({ message: 'Welcome' });
// });
router.get('/api', function (req, res, next) {
  res.json({ message: 'Welcom' });
})

router.use('/config', config);

module.exports = router;
