var gulp = require('gulp'),
    connect = require('gulp-connect'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer');

var paths = {
    styles: {
        src: './www/',
        files: './www/*.scss',
        dest: './www'
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
    gulp.src(paths.styles.files)
    .pipe(sass({
        outputStyle: 'compressed',
        sourceComments: 'map',
        includePaths : [paths.styles.src]
    }))
    .on('error', function(err){
        displayError(err);
    })
    .pipe(prefix(
        'last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'
    ))
    .pipe(gulp.dest(paths.styles.dest))
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

gulp.task('default', ['sass', 'connect'], function() {
    gulp.watch(paths.styles.files, ['sass'])
    .on('change', function(evt) {
        console.log(
            '[watcher] File ' + evt.path.replace(/.*(?=scss)/,'') + ' was ' + evt.type + ', compiling...'
        );
    });
});
