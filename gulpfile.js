'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var spawn = require('child_process').spawn;
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var bump = require('gulp-bump');
var uglify = require('gulp-uglify');

gulp.task('browserify_index', function() {
    return browserify(__dirname + '/js/sketchboard.js')
        .bundle()
        .pipe(source('sketchboard.js'))
        .pipe(gulp.dest(__dirname + '/public/js'));
});

gulp.task('browserify_map', function() {
    return browserify(__dirname + '/js/map.js')
        .bundle()
        .pipe(source('map.js'))
        .pipe(gulp.dest(__dirname + '/public/js'));
});

gulp.task('browserify', ['browserify_index', 'browserify_map']);

gulp.task('uglify', function() {
    return gulp.src(__dirname + '/public/js/*.js')
        .pipe(uglify(/* {outSourceMap: true} */))
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
    runSequence('build', 'uglify', 'bump', 'jitsu', 'clean', 'publish', cb);
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
