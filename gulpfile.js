
const gulp = require('gulp');
const webpack = require('webpack-stream');
const path = require('path');
const dest_app = path.join(__dirname, './dist/app/public');
const config_app = require('./webpack.app.config');
const clean = require('gulp-clean');
const uglifyes=require('uglify-es');
const composer = require('gulp-uglify/composer');
const minify=composer(uglifyes,console);
const pump = require('pump');
const options = {
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
});

//客户端
gulp.task('app.public', function () {
    return gulp.src(['./app/public/**/*.*', '!./app/public/static/**/*.*'], { base: '' })
        .pipe(gulp.dest(dest_app));
});

// gulp.task('app.config',function(){
//     return gulp.src('./app/src/root/index.js')
//         .pipe(webpack(require('./webpack.app.config.js')))
//         .pipe(gulp.dest('./dist/app/public/src'))
// })

gulp.task('app', ['app.public']);

//服务端
const dest_server = path.join(__dirname, './dist/server');
const config_server = require('./webpack.server.config');

gulp.task('server.webpack', function (cb) {
    // const options={};
    pump([
        webpack(config_server),
        minify(options),
        gulp.dest(dest_server)
    ], cb);
});

gulp.task('server.config', function () {
    return gulp.src('server/config.js')
        .pipe(gulp.dest(dest_server));
});
gulp.task('server.config.json', function () {
    return gulp.src('config.json')
        .pipe(gulp.dest(path.resolve(dest_server, '..')));
});

gulp.task('server.package', function () {
    return gulp.src('server/package.json')
        .pipe(gulp.dest(path.resolve(dest_server, '..')));
});

gulp.task('server', ['server.webpack', 'server.config', 'server.config.json', 'server.package']);

gulp.task('default', ['clean'], function () {
    gulp.start(['app', 'server']);
});
