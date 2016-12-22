var gulp = require('gulp');
var webpack = require('webpack-stream');
var path = require('path')
var dest_app = path.join(__dirname, './dist/app/public');
var config_app = require('./webpack.app.config');
var clean = require('gulp-clean');
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

gulp.task('app', ['clean','app.webpack', 'app.public']);


var dest_server = path.join(__dirname, './dist/server');
var config_server = require('./webpack.server.config');

gulp.task('server.config', function () {
    return gulp.src('server/config.js')
        .pipe(gulp.dest(dest_server));
})
gulp.task('server.package', function () {
    return gulp.src('server/package.json')
        .pipe(gulp.dest(path.resolve(dest_server, '..')));
})
gulp.task('server.webpack', function () {
    return webpack(config_server)
        .pipe(gulp.dest(dest_server));
})
gulp.task('server', ['clean','server.webpack', 'server.config', 'server.package']);

gulp.task('default',['app','server']);