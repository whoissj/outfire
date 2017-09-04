'use strict';
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
gulp.task('css',function () {
   return gulp.src('css/style.css')
       .pipe(browserSync.stream());
});
gulp.task('js',function () {
   return gulp.src('js/**')
       .pipe(browserSync.stream());
});
gulp.task('default',function () {
   browserSync.init({
       files:['css/**','js/**','index.html'],
       server:'./'
   })
});