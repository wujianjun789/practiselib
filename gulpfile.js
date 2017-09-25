var gulp = require('gulp');
var webpack = require('webpack-stream');
var path = require('path')
var dest_app = path.join(__dirname, './dist/app/public');
var config_app = require('./webpack.app.config');
var clean = require('gulp-clean');
var uglifyjs = require('uglify-js-harmony'); // replace 'uglify-js' with `uglify-js-harmony` for ES6 support
var minifier = require('gulp-uglify/minifier');
var pump = require('pump');
var options = {
    preserveComments: 'license',
    compress: {
        properties: false,  // optimize property access: a["foo"] → a.foo
        unsafe: false, // some unsafe optimizations (see below)
        conditionals: true,  // optimize if-s and conditional expressions
        comparisons: true,  // optimize comparisons
        evaluate: true,  // evaluate constant expressions
        booleans: true,  // optimize boolean expressions
        loops: true,  // optimize loops
        join_vars: false,  // join var declarations
    }
};
gulp.task('clean', function () {
    return gulp.src('dist/', { read: false })
        .pipe(clean());
})
gulp.task('app.webpack', function () {
    return webpack(config_app)
        .pipe(gulp.dest(dest_app));
});

gulp.task('app.public', function () {
    return gulp.src(['./app/public/**/*.*', '!./app/public/static/**/*.*'], { base: '' })
        .pipe(gulp.dest(dest_app));
});

gulp.task('app', ['app.webpack', 'app.public']);


var dest_server = path.join(__dirname, './dist/server');
var config_server = require('./webpack.server.config');

gulp.task('server.config', function () {
    // return gulp.src('server/config.js')
    return gulp.src('config.json')
        .pipe(gulp.dest(path.resolve(dest_server, '..')));
})
gulp.task('server.package', function () {
    return gulp.src('server/package.json')
        .pipe(gulp.dest(path.resolve(dest_server, '..')));
})
gulp.task('server.webpack', function (cb) {
    pump([
        webpack(config_server),
        minifier(options, uglifyjs),
        gulp.dest(dest_server)
    ],
        cb
    );

})
gulp.task('server', ['server.webpack', 'server.config', 'server.package']);

gulp.task('default', ['clean'], function () {
    gulp.start(['app', 'server']);
});