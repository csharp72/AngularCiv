module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concurrent: {
            default: ['compass','uglify','htmlmin','copy'],
            serve: ['connect::keepalive'],
            test: ['karma']
        },

		watch: {
			compass: {
				files: ['src/scss/**/*.{scss,sass}'],
				tasks: ['compass', 'notify:compass']
			},
			js: {
				files: ['src/js/**/*.js'],
				tasks: ['uglify']
			},
            copy: {
                files: ['src/images/**', 'src/sound/**/*.mp3'],
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

        compass:{
            default: {
            	options: {
                	sassDir: 'src/scss',
                	cssDir: 'app/css',
                	environment: 'production',
                	outputStyle: 'compressed',
            	}
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                // mangle: false,
                // compress: false,
                // beautify: true,
                screwIE8: true,
            },
            my_target: {
                files: {
                    'app/js/main.min.js': [
                        'src/bower_components/angular/angular.min.js', 
                        'src/bower_components/**/*.min.js', 
                        'src/bower_components/firebase/firebase.js',
                        'src/js/index.js',
                        'src/js/*.js'
                    ]
                }
            }
        },

        copy: {
            main: {
                files: [
                    // flattens results to a single level 
                    // {expand: true, cwd: 'src/html/', src: ['**/*.html'], dest: 'app', filter: 'isFile'},
                    {expand: true, cwd: 'src/images/', src: ['**'], dest: 'app/images', filter: 'isFile'},
                    {expand: true, cwd: 'src/sound/', src: ['**/*.mp3'], dest: 'app/sound', filter: 'isFile'},
                    {expand: true, cwd: 'src/bower_components/fontawesome/fonts/', src: ['**'], dest: 'app/fonts', filter: 'isFile'},
                    // {expand: true, cwd: 'src/bower_components', src: ['**/*.js','**/*.css','!**/src/**','!**/demo/**'], dest: 'app/components/' },
                ],
            },
        },

        htmlmin: {
            default: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'app/index.html': 'src/html/index.html',
                }
            }
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

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-concurrent');

	grunt.registerTask('default', ['clean', 'concurrent:default', 'watch']);
	grunt.registerTask('serve', ['connect::keepalive'] );
    grunt.registerTask('test', ['karma'] );

};