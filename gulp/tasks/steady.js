const chalk = require(`chalk`);

module.exports = (gulp, plugins, config) => {
    return done => {

        if (config.debug) {
            console.log(`${chalk.bold(`Копирование статических файлов...`)}`);
        };

        return gulp.src(config.paths.src.steady, {
            base: config.paths.src.root
        })
            .pipe(gulp.dest(config.paths.output.root));
    };
};