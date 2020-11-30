const chalk = require(`chalk`);

module.exports = (gulp, plugins, config) => {
    return done => {

        if (config.debug) {
            console.log(`${chalk.bold(`Создание ZIP-архивов...`)}`);
        };

        const createZip = (type, cb) =>
            gulp.src([`${config.paths[type].root}/**/*.*`, `!${config.paths[type].root}/*.zip`])
                .pipe(plugins.zip(config.files.zip[type]))
                .pipe(gulp.dest(config.paths.output.root))
                .on(`end`, cb);

        const createZipSource = cb => createZip(`src`, cb);
        const createZipOutput = cb => createZip(`output`, cb);

        gulp.parallel(createZipSource, createZipOutput)(done);
    };
};