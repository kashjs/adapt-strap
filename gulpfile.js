'use strict';

var gulp = require('gulp'),
  path = require('path'),
  nutil = require('util'),
  combine = require('stream-combiner'),
  pkg = require('./package.json'),
  chalk = require('chalk'),
  fs = require('fs'),
  concat = require('gulp-concat-util'),
  runSequence = require('run-sequence'),
  src = {
    cwd: 'src',
    dist: 'dist_temp',
    scripts: '*/*.js',
    less: ['modules.less'],
    index: 'module.js',
    templates: '*/*.tpl.html',
    docView: '*/docs/*.view.html',
    html: ['src/**/*.html', 'docs/**/*.html'],
    js: ['src/**/*.js', 'docs/**/*.js'],
    watch: ['src/**/*.*','!src/**/docs/*.*']
  },
  banner,
  createModuleName;

require('matchdep')
  .filterDev('gulp-*')
  .forEach(function(module) {
    global[module.replace(/^gulp-/, '')] = require(module);
  });

banner = util.template('/**\n' +
  ' * <%= pkg.name %>\n' +
  ' * @version v<%= pkg.version %> - <%= today %>\n' +
  ' * @link <%= pkg.homepage %>\n' +
  ' * @author <%= pkg.author.name %> (<%= pkg.author.email %>)\n' +
  ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' +
  ' */\n', {file: '', pkg: pkg, today: new Date().toISOString().substr(0, 10)});

// ========== CLEAN ========== //
gulp.task('clean:dist', function() {
  return gulp.src([src.dist + '/*'], {read: false})
    .pipe(clean())
    .on('error', util.log);
});

// ========== SCRIPTS ========== //
gulp.task('scripts:dist', function(foo) {

  var combined = combine(

    // Build unified package
    gulp.src([src.index, src.scripts], {cwd: src.cwd})
      .pipe(sourcemaps.init())
      .pipe(ngmin())
      .pipe(concat(pkg.name + '.js', {process: function(src) { return '// Source: ' + path.basename(this.path) + '\n' + (src.trim() + '\n').replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1'); }}))
      .pipe(concat.header('(function(window, document, undefined) {\n\'use strict\';\n'))
      .pipe(concat.footer('\n})(window, document);\n'))
      .pipe(concat.header(banner))
      .pipe(gulp.dest(src.dist))
      .pipe(rename(function(path) { path.extname = '.min.js'; }))
      .pipe(uglify())
      .pipe(concat.header(banner))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(src.dist)).pipe(gulp.dest(path.join(src.dist, 'modules'))).on('error', function(err) {
        util.log(chalk.red(nutil.format('Plugin error: %s', err.message)));
      }),

    // Build individual modules
    gulp.src(src.scripts, {cwd: src.cwd})
      .pipe(sourcemaps.init())
      .pipe(ngmin())
      .pipe(rename(function(path){ path.dirname = ''; })) // flatten
      .pipe(concat.header(banner))
      .pipe(gulp.dest(path.join(src.dist, 'modules')))
      .pipe(rename(function(path) { path.extname = '.min.js'; }))
      .pipe(uglify())
      .pipe(concat.header(banner))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(path.join(src.dist, 'modules'))).on('error', function(err) {
        util.log(chalk.red(nutil.format('Plugin error: %s', err.message)));
      })

  );

  combined.on('error', function(err) {
    util.log(chalk.red(nutil.format('Plugin error: %s', err.message)));
  });

  return combined;

});


// ========== TEMPLATES ========== //
createModuleName = function(src) { return 'adaptv.adaptStrap.' + src.split(path.sep)[0]; };
gulp.task('templates:dist', function() {

  var combined = combine(

    // Build unified package
    gulp.src(src.templates, {cwd: src.cwd})
      .pipe(htmlmin({removeComments: true, collapseWhitespace: true}))
      .pipe(ngtemplate({module: createModuleName}))
      .pipe(ngmin())
      .pipe(concat(pkg.name + '.tpl.js', {process: function(src) { return '// Source: ' + path.basename(this.path) + '\n' + (src.trim() + '\n').replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1'); }}))
      .pipe(concat.header('(function(window, document, undefined) {\n\'use strict\';\n\n'))
      .pipe(concat.footer('\n\n})(window, document);\n'))
      .pipe(concat.header(banner))
      .pipe(gulp.dest(src.dist))
      .pipe(rename(function(path) { path.extname = '.min.js'; }))
      .pipe(uglify())
      .pipe(concat.header(banner))
      .pipe(gulp.dest(src.dist)).on('error', function(err) {
        util.log(chalk.red(nutil.format('Plugin error: %s', err.message)));
      }),

    // Build individual modules
    gulp.src(src.templates, {cwd: src.cwd})
      .pipe(htmlmin({removeComments: true, collapseWhitespace: true}))
      .pipe(ngtemplate({module: createModuleName}))
      .pipe(ngmin())
      .pipe(rename(function(path){ path.dirname = ''; })) // flatten
      .pipe(concat.header(banner))
      .pipe(gulp.dest(path.join(src.dist, 'modules')))
      .pipe(rename(function(path) { path.extname = '.min.js'; }))
      .pipe(uglify())
      .pipe(concat.header(banner))
      .pipe(gulp.dest(path.join(src.dist, 'modules')))
      .on('error', function(err) {
        util.log(chalk.red(nutil.format('Plugin error: %s', err.message)));
      })

  );

  combined.on('error', function(err) {
    util.log(chalk.red(nutil.format('Plugin error: %s', err.message)));
  });

  return combined;

});

gulp.task('doc:view', function () {
  return gulp.src(src.docView, {cwd: src.cwd})
    .pipe(cheerio(function ($) {
      var publicTags = $('public').html();
      $(':first-child').empty();
      $(':first-child').append(publicTags)
    }))
    .pipe(rename(function (path) {
      path.basename += ".public";
      path.extname = ".html"
    }))
    .pipe(gulp.dest(src.cwd));
})

// ========== STYLE ========== //
gulp.task('less', function () {
  return gulp.src(paths.mainLess)
    .pipe(less())
    .on('error', nutil.log)
    .pipe(gulp.dest('app'))
    .on('error', nutil.log)
    .pipe(connect.reload())
    .on('error', nutil.log);
});

gulp.task('style:dist', function() {
  return gulp.src(src.less, {cwd: src.cwd})
    .pipe(less())
    .pipe(concat(pkg.name + '.css', {process: function(src) { return '/* Style: ' + path.basename(this.path) + '*/\n' + (src.trim() + '\n').replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1'); }}))
    .pipe(concat.header(banner))
    .pipe(gulp.dest(src.dist))
    .pipe(cssmin())
    .pipe(concat.header(banner))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(src.dist))
    .on('error', function(err) {
      util.log(chalk.red(nutil.format('Plugin error: %s', err.message)));
    });
});

gulp.task('style:dist:live', function() {
  return gulp.src(src.less, {cwd: src.cwd})
    .pipe(less())
    .pipe(concat(pkg.name + '.css', {process: function(src) { return '/* Style: ' + path.basename(this.path) + '*/\n' + (src.trim() + '\n').replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1'); }}))
    .pipe(concat.header(banner))
    .pipe(gulp.dest(src.dist))
    .pipe(cssmin())
    .pipe(concat.header(banner))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(src.dist))
    .pipe(connect.reload())
    .on('error', function(err) {
      util.log(chalk.red(nutil.format('Plugin error: %s', err.message)));
    });
});

// ========== validate ========== //
gulp.task('htmlhint', function () {
  gulp.src(src.html)
    .pipe(htmlhint({
      htmlhintrc: '.htmlhintrc'
    }))
    .pipe(htmlhint.reporter());
});

gulp.task('htmlhint:fail', function () {
  gulp.src(src.html)
    .pipe(htmlhint({
      htmlhintrc: '.htmlhintrc'
    }))
    .pipe(htmlhint.failReporter());
});

gulp.task('jshint', function() {
  gulp.src(src.js)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jshint:fail', function() {
  gulp.src(src.js)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function () {
  return gulp.src(src.js)
    .pipe(jscs());
});

// ========== DEFAULT TASKS ========== //
gulp.task('dist', function() {
  runSequence(['jshint:fail', 'htmlhint:fail', 'jscs'],'clean:dist', ['templates:dist', 'scripts:dist', 'style:dist']);
});

gulp.task('dist:release', function() {
  src.dist = 'dist';
  runSequence(['jshint:fail', 'htmlhint:fail', 'jscs'],'clean:dist', ['templates:dist', 'scripts:dist', 'style:dist']);
});


gulp.task('dist:unsafe', function() {
  runSequence('clean:dist', ['templates:dist', 'scripts:dist', 'style:dist:live']);
});

gulp.task('watch', function () {
  gulp.watch(src.watch, ['dist:unsafe'])
    .on('error', util.log);
});

gulp.task('server', function () {
  return connect.server({
    root: '',
    port: 9003,
    livereload: true
  });
});

gulp.task('test', ['jshint', 'jscs', 'htmlhint']);

gulp.task('default', function() {
  runSequence('server','dist:unsafe', 'watch');
});