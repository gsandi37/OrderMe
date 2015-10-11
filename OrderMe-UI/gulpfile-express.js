var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    embedlr = require('gulp-embedlr'),
    refresh = require('gulp-livereload'),
    lrserver = require('tiny-lr')(),
    express = require('express'),
    livereload = require('connect-livereload')
     livereloadport = 35729,
    serverport = 5000;

//We only configure the server here and start it only when running the watch task
var server = express();
//Add livereload middleware before static-middleware
server.use(livereload({
  port: livereloadport
}));
server.use(express.static('./build'));

//Task for sass using libsass through gulp-sass
gulp.task('sass', function() {
  gulp.src('sass/*.scss').pipe(sass()).pipe(gulp.dest('build')).pipe(refresh(lrserver));
});

//Task for processing js with browserify
gulp.task('browserify', function() {
  gulp.src('scripts/*.js').src('scripts/controllers/*.js').pipe(browserify()).pipe(concat('bundle.js')).pipe(gulp.dest('build')).pipe(refresh(lrserver));

});

//Task for moving html-files to the build-dir
//added as a convenience to make sure this gulpfile works without much modification
gulp.task('html', function() {
  gulp.src('views/*.html').pipe(gulp.dest('build')).pipe(refresh(lrserver));
});

//Convenience task for running a one-off build
gulp.task('build', function() {
  gulp.run('html', 'browserify', 'sass');
});

gulp.task('serve', function() {
  //Set up your static fileserver, which serves files in the build dir
  server.listen(serverport);

  //Set up your livereload server
  lrserver.listen(lrport);
});

gulp.task('watch', function() {

  //Add watching on sass-files
  gulp.watch('sass/*.scss', function() {
    gulp.run('sass');
  });

  //Add watching on js-files
  gulp.watch('scripts/*.js', function() {
    gulp.run('browserify');
  });

  //Add watching on html-files
  gulp.watch('views/*.html', function() {
    gulp.run('html');
  });
});

gulp.task('default', function() {
  gulp.run('build', 'serve', 'watch');
});
