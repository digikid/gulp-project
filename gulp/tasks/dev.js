module.exports = (gulp, plugins) => {
    return gulp.series(
        `build`,
        `webserver`,
        `watch`
    );
};