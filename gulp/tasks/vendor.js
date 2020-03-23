const log = require(`fancy-log`);

module.exports = (gulp, plugins, config) => {
    return done => {
        return gulp.src(` `)
            .pipe(plugins.plumber())
            .pipe(plugins.directorySync(config.paths.src.vendor, config.paths.output.vendor, {
                printSummary: true,
                ignore: config.files.bootstrap
            }))
            .on(`error`, log);
    };
};