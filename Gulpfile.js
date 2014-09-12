var gulp = require('gulp'),
plugins = require('gulp-load-plugins')();
plugins.mainBowerFiles = require('main-bower-files');

var paths = {
  templates: 'index.html',
  scss: 'assets/scss/**/*.scss',
  css: './assets/css/**/*.css',
  js: ['assets/js/vendor/*.js', 'assets/js/**/*.js', 'assets/js/app.js'],
  dest: {
    combinedCss: 'assets/css',
    vendorJs: 'assets/js/vendor',
    combinedJs: 'assets/js',
    distTemplates: 'dist',
    distCss: 'dist/assets/css',
    distJs: 'dist/assets/js'
  }
};

gulp.task('connect', function() {
  plugins.connect.server({
    root: './',
    livereload: true
  });
});

gulp.task('templates', function () {
  return gulp.src(paths.templates)
  .pipe(plugins.connect.reload())
  .pipe(plugins.notify('Templates Task Complete'));
});

gulp.task('injectAssets', function () {
  var target = gulp.src('index.html');
  var srcs = paths.js.concat(paths.css);
  var sources = gulp.src(srcs, {read: false});

  return target.pipe(plugins.inject(sources))
  .pipe(gulp.dest('./'));
});

gulp.task('scss', function () {
  return gulp.src(paths.scss)
  .pipe(plugins.sass())
  .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
  .pipe(gulp.dest(paths.dest.combinedCss))
  .pipe(plugins.connect.reload())
  .pipe(plugins.notify('SCSS Task Complete'));
});

gulp.task('js', function () {
  return gulp.src(paths.js)
  .pipe(plugins.connect.reload())
  .pipe(plugins.notify('JS Task Complete'));
});

gulp.task('jsLibs', function () {
  return gulp.src(plugins.mainBowerFiles())
  .pipe( plugins.concat('libs.js') )
  .pipe(plugins.uglify())
  .pipe(plugins.rename('libs.min.js'))
  .pipe(gulp.dest(paths.dest.vendorJs))
  .pipe(plugins.notify('jsLibs Task Complete'));
});

gulp.task('watch', function () {
  gulp.watch([paths.templates], ['templates']);
  gulp.watch([paths.scss], ['scss']);
  gulp.watch([paths.js], ['js']);
});

// BUILD STEPS GO HERE
gulp.task('buildTemplates', function () {
  gulp.src('index.html')
  .pipe(gulp.dest('dist'))
  .pipe(notify('Build Templates Task Complete'));
});

gulp.task('buildCss', function () {
  gulp.src(paths.css)
  .pipe(plugins.minifycss())
  .pipe(gulp.dest(paths.dest.distCss))
  .pipe(plugins.notify('Build CSS Task Complete'));
});

gulp.task('buildJs', function () {
  gulp.src(paths.js)
  .pipe(plugins.uglify())
  .pipe(gulp.dest(paths.dest.distJs))
  .pipe(plugins.notify('Build JS Task Complete'));
});

gulp.task('build', ['buildTemplates', 'buildCss', 'buildJs']);

gulp.task('default', ['scss', 'jsLibs', 'js', 'injectAssets', 'connect', 'watch']);
