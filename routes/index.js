"use strict";
var express = require('express');
var router = express.Router();
var _ = require('underscore');
var utils = require('./utilities.js');
var main = require('../mock/main.json');
var titles = require('../mock/titles.json');




router.get('/main', function(req, res){
	let template = { title: titles['main'] || ''};
	main = utils.jsonHelper(main);
	let obj = _.extend(template, main);
	let helpers = {
		test: function(){
			return "kevin";
		}
	}
	obj = _.extend(obj, helpers);
	res.render('testing', obj);

});

module.exports = router;

