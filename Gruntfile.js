'use strict';

var path = require('path');
var fs = require('fs');
var handlebars = require('handlebars');
var sass = require('node-sass');
var fsExtra = require('fs-extra');
var utils = require('./utilities/utilities.js');

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		nodemon: {
			dev: {
				script: 'app.js'
			}
		},

		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['buildTask'],
				options: {
      				debounceDelay: 1000,
    			}
			},
			handlebars: {
				files: '**/*.handlebars',
				tasks: ['buildTask'],
				options: {
      				debounceDelay: 1000,
    			}
			}
		},
		concurrent: {
      		options: {
        		logConcurrentOutput: true
	      	},
	      	tasks: ['nodemon', 'watch']
    	}   
	});

	
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');

	grunt.registerTask("buildTask", function(){
		//loop through page setup
		let configPath = path.join(__dirname, 'config');
		let buildPath = path.join(__dirname, 'build');
		let componentsPath = path.join(__dirname, 'components');
		let copyPath = path.join(__dirname, 'copy');
		let configFoldersArr = fs.readdirSync(configPath);

		//clear out build path
		rmDir(buildPath);

		//copy over any public files we need
		fsExtra.copySync(path.join(__dirname, 'public'), buildPath);

		//loop through config
		for(let i in configFoldersArr){
			
			let innerPathArr = fs.readdirSync(path.join(configPath, configFoldersArr[i]));


			//loop through inner folder under /config
			for(let j in innerPathArr){
				let innerFile = path.join(configPath, configFoldersArr[i], innerPathArr[j]);
				let jsConfigObj = JSON.parse(fs.readFileSync(innerFile));
				let moduleObj = {'url': jsConfigObj.url};

				//loop through modules in config
				jsConfigObj.modules.forEach(function(moduleRec){
					//grab the modules now from the components folder
					let componentsPathModuleArr = fs.readdirSync(componentsPath);
					//find the corect module we're on
					let module = componentsPathModuleArr.filter(function(rec){ return rec == moduleRec.name; })[0];

					//if it exists
					if (module){

						//jcr path
						let copyPathJCR = path.join(copyPath, configFoldersArr[i], module,  moduleRec.copy);
						
						//put through link and image helper
						let copyJson = utils.linkHelper(fs.readFileSync(copyPathJCR));
						copyJson = utils.imageHelper(copyJson);
						copyJson = JSON.parse(copyJson);

						//compile html into hbs and create <div> module
						let hbsPath = path.join(componentsPath, module, "template", module + ".handlebars");
						let hbsFile = fs.readFileSync(hbsPath).toString();
						let template = handlebars.compile(hbsFile);
						let html = template(copyJson);
						let wrapper = "<div data-module-" + module + ">" + html + "</div>";
						moduleObj['html'] = (moduleObj['html'] || '') + wrapper;

						
						//do sass
						let css = sass.renderSync({
									file: path.join(componentsPath, module, "scss", module + ".scss")
									});
						css = new Buffer(css.css, 'utf8'); 
						moduleObj['css'] = (moduleObj['css'] || '') + ' ' + css;

						//do js
						let jsPath = path.join(componentsPath,  module, "javascript", module + ".js");
						let js = fs.readFileSync(jsPath).toString();
						moduleObj['js'] = (moduleObj['js'] || '') + ' ' + js;

					}

				});

				
				let fileName;
	
				//ensure we have /images, /javascripts, and /stylesheets
				mkDir(path.join(buildPath, "images"));
				mkDir(path.join(buildPath, "javascripts"));
				mkDir(path.join(buildPath, "stylesheets"));

				
				//write css file to file system
				fileName = path.join(buildPath, "stylesheets",  moduleObj['url'] + ".css");
				fs.writeFile(fileName, moduleObj['css']);

				//write js to file system
				fileName = path.join(buildPath, "javascripts", moduleObj['url'] +  ".js");
				fs.writeFile(fileName, "$(document).ready(function(){ " + moduleObj['js'] + "})");

				//create head tag
				let foundationCss = "<link rel='stylesheet' type='text/css' href='/stylesheets/foundation.min.css'>";
				let moduleCombinedCss = "<link rel='stylesheet' type='text/css' href='/stylesheets/" + moduleObj['url'] + 
										".css'>";
				let jqueryJS = "<script src='/javascripts/jquery.js'></script>";
				let foundationJS = "<script src='/javascripts/foundation.min.js'></script>";
				let jsDocumentReady2 = "<script src='/javascripts/" + moduleObj['url'] + ".js'></script>";
				let head = "<head>" + foundationCss + moduleCombinedCss + jqueryJS + foundationJS + jsDocumentReady2 +  "</head>";


				//finally write html file to file system
				moduleObj['html'] = "<html><title></title>" + head + "<body>" + moduleObj['html'] + "</body></html>";
				fileName = path.join(buildPath, moduleObj['url'] + ".html");
				fs.writeFile(fileName, moduleObj['html']);
			}
			
			

		}

		

	})
	
	grunt.registerTask('build',[ 'buildTask', 'concurrent']);


    function rmDir (dirPath) {
      try { var files = fs.readdirSync(dirPath); }
      catch(e) { return; }
      if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
          var filePath = dirPath + '/' + files[i];
          if (fs.statSync(filePath).isFile())
            fs.unlinkSync(filePath);
          else
            rmDir(filePath);
        }
      //fs.rmdirSync(dirPath);
    };

    function mkDir (dirPath){
    	if (!fs.existsSync(dirPath)){
    		fs.mkdirSync(dirPath);
    	}
    }
}