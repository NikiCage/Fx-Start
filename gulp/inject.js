'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var browserSync = require('browser-sync');

gulp.task('inject-reload', ['inject'], function ()
{
    browserSync.reload();
});

gulp.task('inject', ['scripts', 'styles'], function ()
{
    var injectStyles = gulp.src([
        path.join(conf.paths.tmp, '/serve/css/*.css'),
        path.join('!' + conf.paths.tmp, '/serve/css/vendor.css')
    ], {read: false});

    var injectScripts = gulp.src([
            path.join(conf.paths.src, '/scripts/pulgins/*.js'),
            path.join(conf.paths.src, '/scripts/*.js')
        ]);

    var injectHeadScripts = gulp.src(path.join(conf.paths.src, '/scripts/head/*.js'));

    var injectOptions = {
        ignorePath  : [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
        addRootSlash: false
    };

    return gulp.src(path.join(conf.paths.src, '/*.html'))
        .pipe($.inject(injectStyles, injectOptions))
        .pipe($.inject(injectHeadScripts,{
            ignorePath  : [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
            addRootSlash: false,
            starttag: '<!-- inject:head:js -->'
        }))
        .pipe($.inject(injectScripts, injectOptions))
        .pipe(wiredep(conf.wiredep))
        .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});