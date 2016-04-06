'use strict';

var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var cssnano = require('gulp-cssnano');
var del = require('del');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var jade = require('gulp-jade');
var spritesmith = require('gulp.spritesmith');
var stylus = require('gulp-stylus');
var useref = require('gulp-useref');

// Develop

gulp.task('browserSync', function() {
  var files = [
    'app/css/main.css',
    'app/index.html'
  ];

  browserSync.init(files, {
    server: {
      baseDir: 'app'
    },
  })
});

gulp.task('jade', function() {
  return gulp.src('app/jade/index.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('stylus', function () {
  return gulp.src('app/styl/main.styl')
    .pipe(stylus())
    .pipe(autoprefixer())
    .pipe(gulp.dest('app/css'));
});

// Generation images/sprite.png and css/sprite.css => .icon-$imagename

gulp.task('sprite:dev', ['clean:sprite'], function () {
  var spriteData = gulp.src('app/images/sprite/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css',
    imgPath: '../images/sprite.png'
  }));
  //spriteData.pipe(gulpif('sprite.png', gulp.dest('app/images'), gulp.dest('app/css')));
  spriteData.img.pipe(gulp.dest('app/images'));
  spriteData.css.pipe(gulp.dest('app/css'));
});

// Delete images/sprite.png

gulp.task('clean:sprite', function() {
  return del.sync('app/images/sprite.png');
})

gulp.task('watch', ['browserSync', 'sprite:dev'], function () {
  gulp.watch('app/jade/**/*.jade', ['jade']);
  gulp.watch('app/styl/**/*.styl', ['stylus']);
  gulp.watch('app/index.html');
});

// Build

gulp.task('clean:dist', function() {
  return del.sync('dist');
})

// Minify and copy normalize.css

gulp.task('normalize', function() {
  return gulp.src('node_modules/normalize.css/normalize.css')
  .pipe(cssnano())
  .pipe(gulp.dest('dist/css'));
})

// Minify images

gulp.task('images', function(){
  return gulp.src('app/images/*.+(png|jpg)')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/images'));
});

// Concat and minify main.css + sprite.css => main.min.css, minify index.html

gulp.task('useref', ['jade', 'stylus'], function(){
  return gulp.src('app/index.html')
    .pipe(useref())
    .pipe(gulpif('*.css', cssnano()))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
});

gulp.task('build', [
  'clean:dist',
  'normalize',
  'images',
  'useref'
  ], function () {
  console.log('Building');
});