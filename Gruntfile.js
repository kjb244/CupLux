module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		nodemon: {
			dev: {
				script: 'app.js'
			}
		},
		sass: {
			dist: {
		      files: [{
		        expand: true,
		        cwd: 'scss',
		        src: ['*.scss'],
		        dest: 'public/stylesheets',
		        ext: '.css'
		      }]
			}
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['sass']
			},
			scripts: {
				files: '**/*.js'
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
	
	grunt.registerTask('default',['sass', 'concurrent']);
}