module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


		watch: {
			compass: {
				files: ['src/scss/**/*.{scss,sass}'],
				tasks: ['compass:dev', 'notify:compass']
			},
			js: {
				files: ['src/js/**/*.js'],
				tasks: ['uglify']
			},
            copy: {
                files: ['src/**/*.html', 'src/images/**', 'src/sound/**/*.mp3'],
                tasks: ['copy']
            },
            grunt: {
                files: ['gruntfile.js'],
                tasks: ['default']
            }
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
                	sassDir: 'src/scss',
                	cssDir: 'app/css',
                	environment: 'production',
                	outputStyle: 'compressed',
            	}
            },
            dev: {                    // Another target
            	options: {
                	sassDir: 'src/scss',
                	cssDir: 'app/css',
                	environment: 'development',
            	}
            }
         },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                mangle: false,
                compress: false,
                beautify: true,
                screwIE8: true,
            },
            my_target: {
                files: {
                    'app/js/main.min.js': [
                        'src/bower_components/angular/angular.min.js', 
                        'src/bower_components/**/*.min.js', 
                        'src/bower_components/firebase/firebase.js',
                        'src/js/*.js'
                    ]
                }
            }
        },

        copy: {
            main: {
                files: [
                    // flattens results to a single level 
                    {expand: true, cwd: 'src/html/', src: ['**/*.html'], dest: 'app', filter: 'isFile'},
                    {expand: true, cwd: 'src/images/', src: ['**'], dest: 'app/images', filter: 'isFile'},
                    {expand: true, cwd: 'src/sound/', src: ['**/*.mp3'], dest: 'app/sound', filter: 'isFile'},
                    {expand: true, cwd: 'src/bower_components/fontawesome/fonts/', src: ['**'], dest: 'app/fonts', filter: 'isFile'},
                    // {expand: true, cwd: 'src/bower_components', src: ['**/*.js','**/*.css','!**/src/**','!**/demo/**'], dest: 'app/components/' },
                ],
            },
        },

        clean: ["app/*"],

        connect: {
            server: {
				options: {
					port: 8000,
					base: 'app'
				}
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', ['clean', 'compass:dev','uglify','copy','watch']);
	grunt.registerTask('serve', ['connect::keepalive'] );

};