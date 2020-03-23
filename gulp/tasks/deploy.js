module.exports = (gulp, plugins) => gulp.series(
    `build`,
    `upload`,
    `browser`
);