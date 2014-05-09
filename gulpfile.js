'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');

gulp.task('browserify', function() {
    return browserify(__dirname + '/js/index.js')
        .bundle()
        .pipe(source('sketchboard.js'))
        .pipe(gulp.dest(__dirname + '/public/js'));
});

gulp.task('build', ['browserify']);
