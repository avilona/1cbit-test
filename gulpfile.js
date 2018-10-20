'use strict';

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  minify = require('gulp-csso'),
  autoprefixer = require('autoprefixer'),
  spritesmith = require('gulp.spritesmith'),
  postcss = require('gulp-postcss'),
  path = require('path'),
  pug = require('gulp-pug'),
  plumber = require('gulp-plumber'),
  svgmin = require('gulp-svgmin'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  jsmin = require('gulp-jsmin'),
  del = require('del'),
  run = require('run-sequence'),
  browserSync = require('browser-sync'),
  sourcemaps = require('gulp-sourcemaps');

var paths = {
  build: './build/',
  sass: './src/sass/',
  css: './build/css/',
  svgSrc: './src/images/',
  imagesDest: './build/images/',
  imagesSrc: './src/images/',
  fonts: './src/fonts/',
  js: './src/js/'
};

gulp.task('pug', function () {
  return gulp.src('./src/*.pug')
    .pipe(pug())
    .on('error', function (err) {
      process.stderr.write(err.message + '\n');
      this.emit('end');
    })
    .pipe(gulp.dest(paths.build));
});

gulp.task('sass', function() {
 gulp.src(paths.sass + '*.scss')
 .pipe(plumber())
 .pipe(sourcemaps.init())
 .pipe(sass())
 .pipe(postcss([
   autoprefixer({browsers: [
     'last 1 version',
     'last 2 Chrome versions',
     'last 2 Firefox versions',
     'last 2 Opera versions',
     'last 2 Edge versions'
   ]})
 ]))
 .pipe(minify())
 .pipe(rename("style.min.css"))
 .pipe(gulp.dest(paths.css))
 .pipe(browserSync.reload({
   stream: true
 }));
});

gulp.task('scripts', function() {
  gulp.src([paths.js + '/script.js'])
    .pipe(gulp.dest(paths.build + 'js'))
    .pipe(jsmin())
    .pipe(rename(function(path) {
      path.basename += ".min";
    }))
    .pipe(gulp.dest(paths.build + 'js'));
});

gulp.task("svg", function() {
  return gulp.src('build/images/**/*.{svg}')
    .pipe(svgmin())
    .pipe(gulp.dest(paths.imagesDest));
});

gulp.task('images', function() {
  return gulp.src('build/images/**/*.{png,jpg,gif}')
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true})
  ]))
  .pipe(gulp.dest(paths.imagesDest));
});

gulp.task('sprite', function() {
  var spriteData =
    gulp.src('./build/images/icons/*.*')
      .pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprite.scss',
        cssFormat: 'scss'
      }));

    spriteData.img.pipe(gulp.dest('./build/images/'));
    spriteData.css.pipe(gulp.dest('./src/sass/includes/'));
});

gulp.task('copy', function() {
  return gulp.src([
    'src/fonts/**/*.{woff,woff2,otf,ttf}',
    'src/images/**',
    'src/css/**',
    'src/js/**'
  ], {
    base: 'src/'
  })
  .pipe(gulp.dest('build'));
});

gulp.task('clean', function() {
  return del('build');
});

gulp.task('rebuild', ['pug', 'scripts'], function () {
  browserSync.reload();
});

gulp.task('browser-sync', ['sass', 'pug', 'scripts'], function () {
  browserSync({
    server: {
      baseDir: paths.build
    },
    notify: false
  });
});

gulp.task('watch', function () {
  gulp.watch(paths.sass + '**/*.scss', ['sass']);
  gulp.watch('./src/**/*.pug', ['rebuild']);
  gulp.watch('./src/js/**/*.js', [`rebuild`]);
});

gulp.task('build', function(fn) {
  run(
    'clean',
    'copy',
    'images',
    'svg',
    'sprite',
    'scripts',
    'sass',
    'pug',
    fn
  );
});

gulp.task('default', ['browser-sync', 'watch']);
