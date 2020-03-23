module.exports = (gulp, plugins, config) => {
    return done => {
        return gulp.src(config.paths.src.steady, {
            base: config.paths.src.root
        })
            .pipe(gulp.dest(config.paths.output.root))
    };
};