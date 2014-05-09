'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var spawn = require('child_process').spawn;
var rimraf = require('rimraf'); // rimraf directly

gulp.task('browserify', function() {
    return browserify(__dirname + '/js/index.js')
        .bundle()
        .pipe(source('sketchboard.js'))
        .pipe(gulp.dest(__dirname + '/public/js'));
});

gulp.task('build', ['browserify']);

gulp.task('jitsu', function (cb) {
  var jitsu = spawn('jitsu', ['deploy'], { stdio: 'inherit' });
  jitsu.on('close', function (code) {
    cb(code !== 0);
  });
});

gulp.task('clean', function (cb) {
    rimraf(__dirname + '/public/js', cb);
});

gulp.task('deploy', ['build', 'jitsu', 'clean']);
