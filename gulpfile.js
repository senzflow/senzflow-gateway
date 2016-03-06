var __ = require('lodash');
var path = require("path");
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var gls = require('gulp-live-server');
var gulpif = require('gulp-if');
var chmod = require('gulp-chmod');
var dest = gulp.dest;
var outputDirectory = "lib/www/static";
var releaseDirectory = "./releases";
var assert = require('assert');
var fs = require("fs");
var webpack = require("webpack");

var package = require('./package.json');

var webpackConfig = require("./webpack.config");

gulp.task("app", function(callback) {
    webpack(webpackConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
        }));
        callback();
    });
});

gulp.task('vendor-css', function() {
    return gulp.src([
            './bower_components/bootstrap/dist/css/bootstrap.min.css',
            './bower_components/codemirror/lib/codemirror.css',
        ])
        .pipe(concat("vendor.css"))
        .pipe(dest(outputDirectory + '/css'));
});

gulp.task('vendor-js', function() {
    return gulp.src([
        "bower_components/lodash-compat/lodash.min.js",
        "bower_components/jquery/dist/jquery.min.js",
        "bower_components/bootstrap/dist/js/bootstrap.min.js",
        'bower_components/codemirror/lib/codemirror.js',
        'bower_components/codemirror/addon/edit/matchbrackets.js',
        'bower_components/codemirror/mode/javascript/javascript.js',
    ])
        .pipe(concat('vendor.js'))
        .pipe(dest(outputDirectory + '/js'));
});

gulp.task("assets", function() {
    return gulp.src(["lib/www/client/assets/**/*"]).pipe(dest(outputDirectory));
});

gulp.task('clean', require('del').bind(null, [outputDirectory, releaseDirectory]));

gulp.task('build', ["assets", "vendor-css", "vendor-js", "app"]);

gulp.task('build-prod', ["build"], function() {
    return gulp.src([outputDirectory+"/js/*.js"])
        .pipe(uglify())
        .pipe(dest(outputDirectory+"/js"));
});

gulp.task('release', ['build-prod'], function() {
    var _ = require("lodash");
    var dependencies = _.keys(package.dependencies).map(function(mod) {
        return "node_modules/" + mod + "/**/*";
    });
    var isbin = function (file) {
        return path.dirname(file.path) === 'bin';
    };
    var basename = package.name + "-" + package.version;
    return gulp.src([
        "bin/**/*",
        "lib/**/*",
        "package.json",
        "README.md"].concat(dependencies), { base: '.' })
        .pipe(gulpif(isbin, chmod(755)))
        .pipe(rename(function(path) {
            path.dirname = basename + "/" + path.dirname
        }))
        .pipe(tar(basename +'.tar'))
        .pipe(gzip())
        .pipe(dest(releaseDirectory));
});

gulp.task('dev', ['default'], function () {
    // Start the server at the beginning of the task
    var server = gls.new(['--harmony', "--harmony_destructuring", 'lib/www/index.js']);
    server.start();
    gulp.watch(["lib/www/client/src/**/*"], ["app"]);
    gulp.watch(["lib/www/client/assets/**/*"], ["assets"]);
});

gulp.task('default', ['build']);
