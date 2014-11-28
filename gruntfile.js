module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

		watch: {
			compass: {
				files: ['scss/**/*.{scss,sass}'],
				tasks: ['compass:dev', 'notify:compass']
			},
			// js: {
			// 	files: ['js/**/*.js'],
			// 	tasks: ['uglify']
			// }
		},

		notify:{
			compass:{
				options:{
					message: 'SCSS Compiled'
				}
			}
		},

        compass: {                  // Task
            dist: {                   // Target
            	options: {              // Target options
                	sassDir: 'scss',
                	cssDir: 'css',
                	environment: 'production',
                	outputStyle: 'compressed',
            	}
            },
            dev: {                    // Another target
            	options: {
                	sassDir: 'scss',
                	cssDir: 'css',
                	environment: 'development',
            	}
            }
         },

        // uglify: {
        //     options: {
        //         banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        //     },
        //     build: {
        //         src: 'src/<%= pkg.name %>.js',
        //         dest: 'build/<%= pkg.name %>.min.js'
        //     }
        // },

        connect: {
            server: {
				options: {
					port: 8000,
					base: ''
				}
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	// grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-notify');


	grunt.registerTask('default', ['compass:dev', 'watch']);
	grunt.registerTask('serve', ['connect::keepalive'] );

};