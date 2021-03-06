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
		let prodBuildPath = path.join(__dirname, 'prod_build');
		let componentsPath = path.join(__dirname, 'components');
		let copyPath = path.join(__dirname, 'copy');
		let configFoldersArr = fs.readdirSync(configPath);

		//clear out build path
		rmDir(buildPath);

		//copy over any public files we need
		fsExtra.copySync(path.join(__dirname, 'public'), buildPath);

		//copy favicon
		fsExtra.copySync(path.join(__dirname, 'assets', 'images', 'main', 'favicons'), 
									path.join(buildPath, 'images', 'main', 'favicons'));
	
		//loop through config
		for(let i in configFoldersArr){
			
			let innerPathArr = fs.readdirSync(path.join(configPath, configFoldersArr[i]));


			//loop through inner folder under /config
			for(let j in innerPathArr){
				let innerFile = path.join(configPath, configFoldersArr[i], innerPathArr[j]);
				let jsConfigObj = JSON.parse(fs.readFileSync(innerFile));
				let moduleObj = {'url': jsConfigObj.url, 'title': jsConfigObj.title || ''};


				let masterDivWrapper = '<section data-module-master class="row">';
				//loop through modules in config
				jsConfigObj.modules.forEach(function(moduleRec){

					let type = moduleRec.type;
					let sectionWrapper = '<section data-module-' + type + '>';
				
					//loop through the module types: header, body, and footer
					moduleRec.modules.forEach(function(moduleRecInner){
						let clazz= moduleRecInner.class ? ' class="' + moduleRecInner.class + '"' : '';
						//get root directory
						//first put into array ex: master, body-module
						let rootPathModule = moduleRecInner.name.replace(/^\/{1}/,'').split('/');
						//name is only body-module
						moduleRecInner.name = rootPathModule[rootPathModule.length - 1];
						//rootpath is only master
						rootPathModule = rootPathModule[0];
						
						//grab the modules now from the components folder
						let componentsPathModuleArr = fs.readdirSync(path.join(componentsPath, rootPathModule));
						
						//find the corect module we're on
						let module = componentsPathModuleArr.filter(function(rec){ return rec == moduleRecInner.name; })[0];

						//if it exists
						if (module){

							//jcr path
							let copyPathJCR = path.join(copyPath, rootPathModule, module,  moduleRecInner.copy);
							
							//put through link and image helper
							let copyJson = utils.linkHelper(fs.readFileSync(copyPathJCR));
							copyJson = utils.imageHelper(copyJson);
							copyJson = JSON.parse(copyJson);


							//compile html into hbs and create <div> module
							let hbsPath = path.join(componentsPath, rootPathModule, module, "template", module + ".handlebars");
							let hbsFile = fs.readFileSync(hbsPath).toString();
							//do helpers
							let helperPath = path.join(componentsPath, rootPathModule, module, "helpers", module + "-helper.js");
							if (existsDir(helperPath)){
								let jsHelper = require(helperPath);
								let jsKeys = Object.keys(jsHelper);
								jsKeys.forEach(function(rec){
								
									handlebars.registerHelper(rec, jsHelper[rec]);

								});
							}

							let template = handlebars.compile(hbsFile);
							let html = template(copyJson);
							let wrapper = "<div data-module-" + module + clazz +  ">" + html + "</div>";

							moduleObj['html' + type] = (moduleObj['html' + type]  || '') + wrapper;

							//do sass
							if (existsDir(path.join(componentsPath, rootPathModule, module, "scss", module + ".scss"))){
								
								let css = sass.renderSync({
											file: path.join(componentsPath, rootPathModule, module, "scss", module + ".scss")
											});
								css = new Buffer(css.css, 'utf8'); 
								//only add if it's not there
								if (!(moduleObj['css'] || '').includes(css)){
									moduleObj['css'] = (moduleObj['css'] || '') + ' ' + css;
								}
								
							}

							//do js
							if (existsDir(path.join(componentsPath, rootPathModule,  module, "javascript", module + ".js"))) {
								let jsPath = path.join(componentsPath, rootPathModule,  module, "javascript", module + ".js");
								let js = fs.readFileSync(jsPath).toString();
								//only add if it's not there
								if (!(moduleObj['js'] || '').includes(js)){
									moduleObj['js'] = (moduleObj['js'] || '') + ' ' + js;
								}
								
							}

						}

					});
					
					sectionWrapper += (moduleObj['html' + type] || '') + '</section>';
					moduleObj['html'] = (moduleObj['html'] || '') + sectionWrapper;
				});

				moduleObj['html'] = masterDivWrapper +  moduleObj['html'] + '</section>';

				
				let fileName;
	
				//ensure we have /images, /javascripts, and /stylesheets
				mkDir(path.join(buildPath, "images"));
				mkDir(path.join(buildPath, "javascripts"));
				mkDir(path.join(buildPath, "stylesheets"));

				//compile foundation sass and add to /stylesheets
				if (existsDir(path.join(componentsPath, "utils", "scss", "foundation.scss"))){
					
					let css = sass.renderSync({
								file: path.join(componentsPath, "utils", "scss", "foundation.scss")
								});
					css = new Buffer(css.css, 'utf8'); 

					fileName = path.join(buildPath, "stylesheets", "foundation.css");
					fs.writeFileSync(fileName, css);
					
				}

				
				//write css file to file system
				fileName = path.join(buildPath, "stylesheets",  moduleObj['url'] + ".css");
				fs.writeFileSync(fileName, moduleObj['css']);

				//write js to file system
				fileName = path.join(buildPath, "javascripts", moduleObj['url'] +  ".js");
				fs.writeFileSync(fileName, "$(document).ready(function(){ " + moduleObj['js'] + "})");

				//create head tag
				let title = "<title>" + moduleObj['title'] + "</title>";
				let foundationMetaTag = "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
				let camptonBoldCss = "<link rel='stylesheet' type='text/css' href='stylesheets/campton_bold_macroman/stylesheet.css'>";
				let camptonLightCss = "<link rel='stylesheet' type='text/css' href='stylesheets/campton_light_macroman/stylesheet.css'>";
				let foundationCss = "<link rel='stylesheet' type='text/css' href='stylesheets/foundation.css'>";
				let fontAwesomeCss = "<link rel='stylesheet' type='text/css' href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'>";
				let moduleCombinedCss = "<link rel='stylesheet' type='text/css' href='stylesheets/" + moduleObj['url'] + 
										".css'>";
				let favicon = "";
				let faviconFilePath = fs.readdirSync(path.join(buildPath, "images", "main", "favicons"));
				if (faviconFilePath[0]){
					favicon = "<link rel='icon' href='./images/main/favicons/" + faviconFilePath[0] + "'>";
				}
				let jqueryJS = "<script src='javascripts/jquery.js'></script>";
				let foundationJS = "<script src='javascripts/foundation.min.js'></script>";
				let jsDocumentReady2 = "<script src='javascripts/" + moduleObj['url'] + ".js'></script>";
				let googleAnalytics = `<script>
										  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
										  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
										  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
										  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

										  ga('create', 'UA-71578091-1', 'auto');
										  ga('send', 'pageview');

										</script>`;
				let head = "<head>" + title + foundationMetaTag +  camptonBoldCss + camptonLightCss + 
				           foundationCss + favicon + fontAwesomeCss + moduleCombinedCss + jqueryJS + foundationJS + 
				           jsDocumentReady2 + googleAnalytics + "</head>";


				//finally write html file to file system
				moduleObj['html'] = "<html>" + head + "<body>" + moduleObj['html'] + "</body></html>";
				fileName = path.join(buildPath, moduleObj['url'] + ".html");
				fs.writeFileSync(fileName, moduleObj['html']);
			}
			
			

		}

		//do production build
		rmDir(prodBuildPath);


		if(grunt.option('githubBuild') && grunt.option('githubBuild') == true) {


			//copy local build into prod
			fsExtra.copySync(buildPath, prodBuildPath);

			//loop through files in prodBuildPath
			let htmlFilePath = fs.readdirSync(prodBuildPath);
			for (let j in htmlFilePath){
				let filePath = path.join(prodBuildPath,htmlFilePath[j]);
				//fix html issues
				if (! isDir(filePath)){
					let content = fs.readFileSync(filePath).toString();
					//change images
					content = content.replace(/src='\/images/g, "src='\.\/images")
					//change links
									 .replace(/(<a href=')(\/)([A-z-]+)/g,"$1.$2$3.html");
					

					//delete file
					fs.unlinkSync(filePath);
					//rewrite
					fs.writeFileSync(filePath, content);
				}
				
			}

			//now loop through css files and fix background image issues
			let cssFilePath = fs.readdirSync(path.join(prodBuildPath,'stylesheets'));
			for(let j in cssFilePath){
				let filePath = path.join(prodBuildPath, 'stylesheets', cssFilePath[j]);
				if (! isDir(filePath)){
					if (filePath.includes('foundation')){
						continue;
					}
					let content = fs.readFileSync(filePath).toString();

					content = content.replace(/(background-image:)(\s+)(url\("|')(\/images)/g,"$1$2$3../images")
									 .replace(/(background:)(\s+)(url\("|')(\/images)/g,"$1$2$3../images");
					//delete file
					fs.unlinkSync(filePath);
					//rewrite
					fs.writeFileSync(filePath, content);
				}
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

    function existsDir (dirPath){
    	if (fs.existsSync(dirPath)){
    		return true;
    	}
    	return false;
    }

    function isDir (dirPath){
    	return fs.lstatSync(dirPath).isDirectory()
    }

    function mkDir (dirPath){
    	if (!fs.existsSync(dirPath)){
    		fs.mkdirSync(dirPath);
    	}
    }
}