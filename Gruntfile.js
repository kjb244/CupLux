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
		let configFoldersArr = fs.readdirSync(configPath);
		rmDir(buildPath);
		for(let i in configFoldersArr){
			
			let innerPathArr = fs.readdirSync(configPath + "\\" + configFoldersArr[i]);

			for(let j in innerPathArr){
				let innerFile = configPath + "\\" + configFoldersArr[i] + "\\" + innerPathArr[j];
				let jsConfigObj = JSON.parse(fs.readFileSync(innerFile));
				let moduleObj = {'url': jsConfigObj.url};
				jsConfigObj.modules.forEach(function(moduleRec){
					//grab the modules now from the components folder
					let componentsPath = path.join(__dirname, 'components');
					let componentsPathModuleArr = fs.readdirSync(componentsPath);
					let module = componentsPathModuleArr.filter(function(rec){ return rec == moduleRec.name; })[0];
					if (module){
						//hbs
						//get copy
						let copyPath = path.join(__dirname, 'copy') + "\\" + configFoldersArr[i] + "\\" + module + "\\" + moduleRec.copy;
						
						let copyJson = utils.linkHelper(JSON.parse(fs.readFileSync(copyPath)));
						copyJson = utils.imageHelper(copyJson);
						copyJson = JSON.parse(copyJson);


						let hbsPath = componentsPath + "\\" + module + "\\" + "template" + "\\" + module + ".handlebars";
						let hbsFile = fs.readFileSync(hbsPath).toString();
						let template = handlebars.compile(hbsFile);
						let html = template(copyJson);
						let wrapper = "<div data-module-" + module + ">" + html + "</div>";
						moduleObj['html'] = (moduleObj['html'] || '') + wrapper;

						//do sass
						let css = sass.renderSync({
									file: componentsPath + "\\" + module + "\\" + "scss" + "\\" + module + ".scss"
									});
						css = new Buffer(css.css, 'utf8'); 
						moduleObj['css'] = (moduleObj['css'] || '') + ' ' + css;

						//put js into string
						let jsPath = componentsPath + "\\" + module + "\\" + "javascript" + "\\" + module + ".js";
						let js = fs.readFileSync(jsPath).toString();
						moduleObj['js'] = (moduleObj['js'] || '') + ' ' + js;
						
						

					}

				});

				
				let fileName;

				//copy all files over from public
				if (i==0 && j ==0){
					
					fsExtra.copySync(path.join(__dirname, 'public'), buildPath);
				}


				//ensure we have /images, /javascripts, and /stylesheets
				mkDir(buildPath + "\\images");
				mkDir(buildPath + "\\javascripts");
				mkDir(buildPath + "\\stylesheets");

				
				//write css file to file system
				fileName = buildPath + "\\" + "stylesheets" + "\\" + moduleObj['url'] + ".css";
				fs.writeFile(fileName, moduleObj['css']);

				//write js to file system
				fileName = buildPath + "\\" + "javascripts" + "\\" + moduleObj['url'] + ".js";
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
				fileName = buildPath + "\\" + moduleObj['url'] + ".html"
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