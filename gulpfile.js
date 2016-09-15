var gulp = require('gulp'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    prefix = require('gulp-autoprefixer')
    rename = require('gulp-rename');

var paths = {
    files: {
        src: './www/',
        styles: './www/css/',
        sass: './www/css/*.scss',
        scripts: './www/js/',
        js: './www/js/src/*.js',
        vendor: './www/js/lib/*.js'
    }
}

gulp.task('connect', function () {
    'use strict';
    return connect.server({
        root: './www',
        livereload: true,
        port: 9898
    });
});

gulp.task('sass', function (){
    gulp.src(paths.files.sass)
    .pipe(sass({
        outputStyle: 'compressed',
        sourceComments: 'map',
        includePaths : [paths.files.sass]
    }))
    .on('error', function(err){
        displayError(err);
    })
    .pipe(prefix(
        'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'
    ))
    .pipe(gulp.dest(paths.files.styles))
});

gulp.task('concat', function (){
    return gulp.src([paths.files.vendor, paths.files.js])
        .pipe(concat('all.js'))
        .pipe(gulp.dest(paths.files.scripts))
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(gulp.dest(paths.files.scripts))
});

gulp.task('watch', function (){
    gulp.watch(paths.files.sass, ['sass'])
    .on('change', function(evt) {
        console.log(
            '[watcher] File ' + evt.path.replace(/.*(?=scss)/,'') + ' was ' + evt.type + ', compiling...'
        );
    });
    gulp.watch(paths.files.js, ['concat'])
    .on('change', function(evt) {
        console.log(
            '[watcher] File ' + evt.path.replace(/.*(?=js)/,'') + ' was ' + evt.type + ', compiling...'
        );
    });
});

var displayError = function(error) {
    var errorString = '[' + error.plugin + ']';
    errorString += ' ' + error.message.replace("\n",'');
    if(error.fileName)
        errorString += ' in ' + error.fileName;
    if(error.lineNumber)
        errorString += ' on line ' + error.lineNumber;
    console.error(errorString);
}

gulp.task('default', ['sass', 'connect', 'concat', 'watch'], function() {
});
