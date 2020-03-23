const fs = require(`fs`);

module.exports = (gulp, plugins, config) => {
    return done => {
        if (fs.existsSync(config.paths.src.sass.bootstrap)) {
            return gulp.src(config.paths.src.sass.bootstrap)
                .pipe(plugins.changed(`${config.paths.output.vendor}/css`))
                .pipe(plugins.plumber())
                .pipe(plugins.sass())
                .pipe(plugins.if(!config.unicode, plugins.sassUnicode()))
                .pipe(plugins.autoprefixer())
                .pipe(plugins.concat(config.files.bootstrap))
                .pipe(plugins.cleanCss())
                .pipe(gulp.dest(`${config.paths.output.vendor}/css`));
        } else {
            done();
        };
    };
};