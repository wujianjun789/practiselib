const express = require('express');
const router = express.Router();
const fs = require('fs');
const config = require("../routes/config");
/* GET home page. */

router.use('/config', config);

module.exports = router;
