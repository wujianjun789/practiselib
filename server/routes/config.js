/**
 * Created by a on 2017/8/10.
 */
const express = require('express');
const router = express.Router();
const client = require('../config').client;

/* GET config listing. */
router.get('/', function (req, res, next) {
    res.json(client.HOST_IP);
});

router.get('/map', function (req, res, next) {
    res.json(client.map);
});

router.get('/module', function (req, res, next) {
    res.json(client.module);
});

module.exports = router;