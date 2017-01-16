"use strict";
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var path = require('path');

let buildDirectory = path.join(__dirname, '../', '/build/');

router.get('/', function(req, res){
	res.redirect('/main');
});

router.get('/main', function(req, res){
	res.sendFile(buildDirectory + 'main.html');
});

router.get('/nature-for-all', function(req, res){
	res.sendFile(buildDirectory + 'nature-for-all.html');
});

module.exports = router;

