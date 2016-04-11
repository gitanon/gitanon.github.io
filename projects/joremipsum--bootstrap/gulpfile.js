'use strict';

// Alphabet

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
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var uncss = require('gulp-uncss');
var useref = require('gulp-useref');

// Develop

gulp.task('browserSync', function () {
  var files = [
    'app/css/main.css',
    'app/index.html'
  ];

  browserSync.init(files, {
    server: {
      baseDir: 'app'
    }
  });
});

gulp.task('jade', function () {
  return gulp.src('app/jade/index.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('less', function () {
  return gulp.src('app/less/main.less')
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(uncss({
      html: ['app/index.html']
    }))
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

gulp.task('clean:sprite', function () {
  return del.sync('app/images/sprite.png');
});

gulp.task('watch', ['browserSync', 'sprite:dev'], function () {
  gulp.watch('app/jade/**/*.jade', ['jade']);
  gulp.watch('app/less/**/*.less', ['less']);
  gulp.watch('app/index.html');
});

// Build

gulp.task('clean:dist', function () {
  return del.sync('dist');
});

// Minify and copy js files

gulp.task('js', function () {
  return gulp.src('app/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

// Minify images

gulp.task('images', function () {
  return gulp.src('app/images/*.+(png|jpg)')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
});

// Concat and minify main.css + sprite.css => main.min.css, minify index.html

gulp.task('useref', ['jade', 'less'], function () {
  return gulp.src('app/index.html')
    .pipe(useref())
    .pipe(gulpif('*.css', cssnano()))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', [
  'clean:dist',
  'js',
  'images',
  'useref'
], function () {});