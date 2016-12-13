'use strict';

var exports = module.exports = {};
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');


exports.imageHelper = function(inp){
	//put IMAGE elements into object so we can loop through
	inp = JSON.parse(inp);

	let imageObj = inp.IMAGE || {};
	let srcArr = [];

	//reconvert to json
	inp = JSON.stringify(inp);
	

	//put in div in jcr

	for(let key in imageObj){

		let dataDest = "/" + imageObj[key]['src'];
		let clazz = imageObj[key]['class'] || '';
		let id = imageObj[key]['id'] || '';
		let div = "<div class='" + clazz + "' id='" + id + "' " + "data-dest='" + dataDest + "'></div>";
		let imageMatcher = "{IMAGE\\|\\|" + key + "}";

		let re = new RegExp(imageMatcher, 'g');
		inp = inp.replace(re,  div);


		srcArr.push(imageObj[key]['src']);
	}
	

	//copy files over
	let buildPath = path.join(__dirname, '../', '/build');
	for(let i in srcArr){
		let fileArr = srcArr[i].split('/');
		
		let pathTemp = buildPath;
		for(let j in fileArr){
	
			let folder = !/\.|w+/.test(fileArr[j]);
			//if folder then create it
			if (folder){
				pathTemp = path.join(pathTemp, fileArr[j]);
				//createFolder(pathTemp)
			}
			//if file then copy it
			else{
				let fromFilePath = path.join(__dirname, '../assets', srcArr[i]);
				let toFilePath = path.join(buildPath);
				for(let k in fileArr){
					toFilePath = path.join(toFilePath, fileArr[k]);
				}

			
				fse.copySync(fromFilePath, toFilePath);
			}


		}


	}

	return inp;

}


exports.linkHelper = function(inp){
	//do links
	var links = {};
	var key;
	var key2;
	//create link id and content
	for(key in inp.LINKS){


		var aTag = '<a';
		var node = inp.LINKS[key];

		for(var key2 in node){
			if (! /content/.test(key2)){
				aTag += " " + key2 + "='" + node[key2] + "'";
			}
		}
		
		aTag += '>';
		aTag += node.content || '';
		aTag += '</a>'
		
		links[key] = aTag;
	}

	//convert entire json to string and start replacing
	inp = JSON.stringify(inp);


	//loop through links object and replace
	for(key in links){
		inp = inp.replace('"{LINK||' + key + '}"', '"' + links[key] + '"');
	}

	//return string
	return inp;



}

function createFolder(dir){
	if(!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}
}