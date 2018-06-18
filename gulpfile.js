var gulp = require('gulp');
var minifyCss = require('gulp-clean-css');
//var minify = require('gulp-minify');
var minify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var babel = require("gulp-babel");

gulp.task('minify-css', function () {
    gulp.src('./src/css/style.css')
    .pipe(rename('designer_q.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(minifyCss())
    .pipe(rename('designer_q.min.css'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('minify-js', function () {
    gulp.src([
        './src/js/functions.js',
        './src/js/drag.js',
        './src/js/main.js'
    ])
    .pipe(concat('designer_q.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(minify())
    .pipe(rename('designer_q.min.js'))
    .pipe(gulp.dest('dist/js'));
});
gulp.task('default', function () {
    gulp.start('minify-css', 'minify-js')
});