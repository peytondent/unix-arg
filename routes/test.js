/**
 * Created by Peyton on 2/13/2017.
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.status(404).send('Not found');
});

module.exports = router;