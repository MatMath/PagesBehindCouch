/* global require */
/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are splitted in several files in the gulp directory
 *  because putting all here was really too long
 */

'use strict';

// Dependency needed that was not installed  by npm (yet): https://github.com/benoitc/erica

var gulp = require('gulp');
var wrench = require('wrench');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var del = require('del');
var argv = require('yargs').argv;
var shell = require('gulp-shell');
var push = require('couch-push');

// Password storage
var pass_file = require('./.couchpass.json');
var user_name = pass_file.user;
var password = pass_file.pass;

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
wrench.readdirSyncRecursive('./gulp').filter(function(file) {
	return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
	require('./gulp/' + file);
});


/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', ['clean'], function() {
	gulp.start('build');
});

gulp.task('min', function() {
	gulp.src(['src/**/module.js', 'src/**/*.js'])
		.pipe(concat('app.js'))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest('.'));
});

// exposed: gulp buildClient --client=client1
gulp.task('buildClient', function() {
	var clientLocation = 'clientSpecificCode/'+argv.client+'/**'
	del(['src/app/currentClient']);
	gulp.src([clientLocation])
		.pipe(gulp.dest('src/app/currentClient'));
});

gulp.task('couch-push', function() {
	var listOfFile = ["en.json", "fr.json", "zh_cn.json", "de.json"];
	// This is a temporary setup to Begin with basic translation in a global folder, later this will be in a separate Repo handled by Weblate Soft.
	for (var file in listOfFile) {
		push('http://localhost:5984/globals', 'src/app/languages/'+listOfFile[file], function(err, resp) {
		  console.log('globals: '+listOfFile[file], resp);
		});
	}

	// This is a temporary setup to Begin with basic translation in a global folder, later this will be in a separate Repo handled by Weblate Soft.
	for (var fileSpecific in listOfFile) {
		push('http://localhost:5984/globals', 'src/app/currentClient/languages/'+listOfFile[fileSpecific], function(err, resp) {
		  console.log('currentClient '+listOfFile[fileSpecific], resp);
		});
	}
});

gulp.task('ericapush', shell.task([
  'erica push ./ericaPushThis https://'+user_name+':'+password+'@localhost:6984/testdb'
]));

