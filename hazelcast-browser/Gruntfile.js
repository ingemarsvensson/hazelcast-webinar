	'use strict';

	var rewriteModule = require('http-rewrite-middleware');

	module.exports = function (grunt) {

		require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

		grunt.initConfig({


			watch: {
				template:{
					options:{
						livereload:35729
					},
					files:[
						'app/template/**/*.less',
						'app/template/**/*.html',
						'app/template/**/*.js'
					],
					tasks: ['less:template']
				},
				default:{
					options: {
						livereload:35729
					},
					files: [
						'app/amd/**/*',
						'app/assets/less/**/*.less',
						'app/index.html'
					],
					tasks: ['watchtask']
				}
			},


			express: {
				options: {

				},
				dev:{
					options:{
	 					script:'server.js'
					}
				}
			},


			connect: {
				template:{
					proxies: [
						{
							context:['/api'],
							host:'127.0.0.1',
							port:8081,
							rewrite:{
								'^/api':''
							}
						}
					],
					options:{
						port:8080,
						base:'app',
						middleware: function (connect, options) {
				            var middlewares = [];
				            middlewares.push(rewriteModule.getMiddleware([
								{from:'^/api$', to:'/'}
							]));
				            middlewares.push(require('grunt-connect-proxy/lib/utils').proxyRequest);

				            if (!Array.isArray(options.base)) {
				              options.base = [options.base];
				            }
				            var directory = options.directory || options.base[options.base.length - 1];
				            options.base.forEach(function (base) {
				              middlewares.push(connect.static(base));
				            });
				            middlewares.push(connect.directory(directory));
				            return middlewares;
				          }
					}
				}
			},


			copy: {
				/*
					We should edit vendor libraries so we copy the fonts into the place we need them
				*/
				bootstrapFontsDev: {
					expand:true,
					cwd:'app/libs/bootstrap/fonts/',
					src:['**'],
					dest:'app/assets/fonts/'
				},
				bootstrapFontsProduction: {
					expand:true,
					cwd:'app/libs/bootstrap/fonts/',
					src:['**'],
					dest:'dist/app/fonts/'
				},
				serverLibsProduction: {
					expand:true,
					cwd:'app/',
					src:[
						'libs/moment/**',
						'libs/lodash/**'
					],
					dest:'dist/app/'
				},
				images:{
					expand:true,
					cwd:'app/',
					src:['assets/img/**'],
					dest:'dist/app/'
				}
			},


			less: {
				template: {
					options: {
						compress:false,
						sourceMap:true,
						sourceMapFilename:'app/template/template.less.map',
						sourceMapBasepath:'app/template/'
					},
					files:{
						'app/template/template.css':'app/template/template.less'
					}
				},
				dev: {
					options: {
						compress:false,
						sourceMap:true,
						sourceMapFilename:'app/assets/less/style.css.map',
						sourceMapBasepath:'app/assets/less/'
					},
					files:{
						'app/assets/less/styles.css':'app/assets/less/styles.less'
					}
				},
				production: {
					options: {
						compress:true
					},
					files: {
						'dist/app/styles.css':'app/assets/less/styles.less'
					}
				}
			},

			uglify: {
				options: {
					mangle:false,
					compress:{
						drop_console:true
					}
				},
				production: {
					files: {
						'dist/app/app.js':[
							'app/libs/jquery/dist/jquery.js',
							'app/libs/angular/angular.js',
							'app/libs/angular-route/angular-route.js',
							'app/libs/angular-bootstrap/ui-bootstrap.js',
							'app/libs/angular-bootstrap/ui-bootstrap-tpls.js',
							'app/libs/lodash/dist/lodash.min.js',
							'app/libs/moment/moment.js',
							'app/libs/moment-duration-format/lib/moment-duration-format.js',
							'app/amd/amd.js',
							'app/amd/routes.js',
							'app/amd/utilities/filterSlice.js',
							'app/amd/navigation/topnavController.js'
						]
					}
				}
			}

		});

		grunt.registerTask('watchtask', ['less:dev','copyfonts']);

		grunt.registerTask('copyfonts', ['copy:bootstrapFontsDev']);

		grunt.registerTask('fixpaths', 'Fixing paths', function() {
			grunt.file.write('dist/app/styles.css', grunt.file.read('dist/app/styles.css', {encoding:'utf8'}).replace(/(\.\.\/fonts\/)/gmi, 'fonts/'), {encoding:'utf8'});
		});

		grunt.registerTask('productionIndex', 'Copying prod index', function() {
			grunt.file.copy('app/index-prod.html', 'dist/app/index.html');
		});

		grunt.registerTask('injectPartials', 'Putting partial templates into the JS', function() {

			/* temporarily copying partials over */
			var js = grunt.file.read('dist/app/app.js', {encoding:'utf8'});
			var files = js.match(/(templateUrl:['"]\/amd\/).*?(html['"])/gmi);
			files.forEach(function(file) {
				file = file.split('/amd/')[1].split('"')[0];
				grunt.file.copy('app/amd/'+file, 'dist/app/amd/'+file);
			});

			grunt.file.copy('app/amd/navigation/topnav.html', 'dist/app/amd/navigation/topnav.html');

			/*

				TODO: Move partials into the JS AngularJS template cache as strings, then uglify

				Work out a solution for ngIncludes

			*/
			// var js = grunt.file.read('dist/app/app.js', {encoding:'utf8'});
			// js = 'a.otherwise({templateUrl:"/cs/dashboard/dashboard.html",controller:"dashboardCtrl",reloadOnS';

			// var matches = js.match(/(templateUrl:['"]\/cs).*?(html['"])/gmi);
			// matches.forEach(function(matched) {
			// 	var file = 'app/'+matched.split('/cs');
			// });
			// js.match(/(templateUrl:['"]\/cs).*?(html['"])/gmi).map(function(matched) {
			// 	var file = grunt.file.read(('app/cs'+matched.split('/cs')[1]).split('"')[0], {encoding:'utf8'});
			// 	js = js.replace(matched, file.replace(/\n/gmi, ''));
			// });
			// grunt.file.write('dist/app.js', js, {encoding:'utf8'});

		});

		grunt.registerTask('server', 'Copying server and package.json over for npm install', function() {
			grunt.file.copy('config.sample.js', 'dist/config.sample.js');
			grunt.file.copy('server.js', 'dist/server.js');
			grunt.file.copy('package.json', 'dist/package.json');
			var packageJSON = JSON.parse(grunt.file.read('dist/package.json', {encoding:'utf8'}));
			Object.keys(packageJSON.devDependencies).forEach(function(dependency) {
				if (['grunt', 'match'].indexOf(dependency.slice(0,5)) >= 0) {;
					delete packageJSON.devDependencies[dependency];
				}
			});
			grunt.file.write('dist/package.json', JSON.stringify(packageJSON), {encoding:'utf8'});
		});

		grunt.registerTask('default', ['watchtask', 'express', 'watch']);
		grunt.registerTask('production', ['less:production', 'copy:bootstrapFontsProduction', 'copy:images', 'fixpaths', 'productionIndex', 'uglify:production', 'injectPartials', 'copy:serverLibsProduction', 'server']);
		grunt.registerTask('template', ['configureProxies:template', 'connect', 'less:template', 'watch:template']);

	};
