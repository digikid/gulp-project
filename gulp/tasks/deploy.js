module.exports = (gulp, plugins, config) => done => {
    config.mode = config.mode === `dev` ? `build` : config.mode;

    gulp.series(
        `build`,
        `upload`,
        `browser`
    )(done);
};