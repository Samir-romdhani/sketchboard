'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var spawn = require('child_process').spawn;
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var bump = require('gulp-bump');

gulp.task('browserify', function() {
    return browserify(__dirname + '/js/index.js')
        .bundle()
        .pipe(source('sketchboard.js'))
        .pipe(gulp.dest(__dirname + '/public/js'));
});

gulp.task('build', ['browserify']);

gulp.task('bump', function () {
    gulp.src('./*.json')
        .pipe(bump({ type:'patch' }))
        .pipe(gulp.dest('./'));
});

gulp.task('jitsu', function (cb) {
    spawn('jitsu', ['deploy'], { stdio: 'inherit' })
        .on('close', function (code) {
            cb(code !== 0);
        });
});

gulp.task('clean', function (cb) {
    rimraf(__dirname + '/public/js', cb);
});

gulp.task('commit', function (cb) {
    var pkg = require('./package.json');
    var v = 'v' + pkg.version;
    var message = 'Release ' + v;

    spawn('git', ['commit', '-a', '-m', message], { stdio: 'inherit' })
        .on('close', function (code) {
            cb(code !== 0);
        });
});

gulp.task('tag', function (cb) {
    var pkg = require('./package.json');
    var v = 'v' + pkg.version;

    spawn('git', ['tag', v], { stdio: 'inherit' })
        .on('close', function (code) {
            cb(code !== 0);
        });
});

gulp.task('push', function (cb) {
    spawn('git', ['push', 'origin', 'master', '--tags'], { stdio: 'inherit' })
        .on('close', function (code) {
            cb(code !== 0);
        });
});

gulp.task('publish', function (cb){
    runSequence('commit', 'tag', 'push', cb);
});

gulp.task('deploy', function (cb) {
    runSequence('build', 'bump', 'jitsu', 'clean', 'publish', cb);
});

gulp.task('server', function (cb) {
    spawn('node', ['server'], { stdio: 'inherit' })
        .on('close', function (code) {
            cb(code !== 0);
        });
});

gulp.task('run', function (cb) {
    runSequence('build', 'server', cb);
});
