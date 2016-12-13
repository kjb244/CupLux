"use strict";
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var path = require('path');

let buildDirectory = path.join(__dirname, '../', '/build/');


router.get('/main', function(req, res){
	res.sendFile(buildDirectory + 'main.html');
});

router.get('/main2', function(req, res){
	res.sendFile(buildDirectory + 'main2.html');
});

module.exports = router;

