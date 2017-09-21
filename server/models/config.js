/**
 * Created by a on 2017/9/21.
 */
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./../config.json'));

module.exports = config;