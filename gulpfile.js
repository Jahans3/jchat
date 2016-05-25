"use strict";

const gulp = require('gulp');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');

gulp.task('sass', function () {
    return gulp.src('./src/dev/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('images', () =>
    gulp.src('src/dev/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
);

gulp.task('default', ['sass', 'images']);