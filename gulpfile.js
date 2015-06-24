// PATHS
// // // // //
var paths = {
  html  : ['_includes/*.html', '_data/*.yml' , 'index.html'],
  sass  : 'assets/_sass/**/*.{sass,scss}',
  js    : 'assets/js'
};

// Requires
// // // // //
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    cp = require('child_process'),
    browserSync = require('browser-sync'),
    gutil = require('gulp-util');

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

// Jekyll build
// // // // // //
gulp.task('jekyll-build', function(done){
  browserSync.notify(messages.jekyllBuild);
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('close', done);
});

// Jekyll rebuild
// // // // // //
gulp.task('jekyll-rebuild', ['jekyll-build'], function(){
  browserSync.reload();
});

// Browser-Sync
// // // // // //
gulp.task('browser-sync', ['sass', 'jekyll-build'], function(){
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

// Sass
// // // // // //
gulp.task('sass', function(){
  return gulp.src('assets/_sass/main.sass')
    .pipe(plumber(function(error) {
        gutil.beep();
        gutil.log(gutil.colors.red(error.message));
        this.emit('end');
    }))
    .pipe(sass({
      includePaths: ['assets/sass']
      //onError: browserSync.notify
    }))
    .pipe(prefix(['last 2 versions', 'ie 9'], { cascade: true }))
    .pipe(gulp.dest('_site/assets/css'))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gulp.dest('assets/css'));
});

// Watch
// // // // // //
gulp.task('watch', function(){
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.html, ['jekyll-rebuild']);
});

// Default
// // // // // //
gulp.task('default', ['browser-sync', 'watch']);
