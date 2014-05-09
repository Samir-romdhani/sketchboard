'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var spawn = require('child_process').spawn;
var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var bump = require('gulp-bump');
var git = require('gulp-git');

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
  var jitsu = spawn('jitsu', ['deploy'], { stdio: 'inherit' });
  jitsu.on('close', function (code) {
    cb(code !== 0);
  });
});

gulp.task('clean', function (cb) {
    rimraf(__dirname + '/public/js', cb);
});

gulp.task('publish', function(){
    var pkg = require('./package.json');
    var v = 'v' + pkg.version;
    var message = 'Release ' + v;

    git.commit(message, { args: '-a' }).end();
    git.tag(v, message);
    git.push('origin', 'master', '--tags');

});

gulp.task('deploy', function (cb) {
    runSequence('build', 'bump', 'jitsu', 'clean', 'push', cb);
});
