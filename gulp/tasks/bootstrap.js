const fs = require(`fs`);
const chalk = require(`chalk`);

module.exports = (gulp, plugins, config) => {
    return done => {
        if (!fs.existsSync(config.paths.src.sass.bootstrap)) {
            done();
            return;
        };

        if (config.debug) {
            console.log(`${chalk.bold(`Сборка Bootstrap...`)}`);
        };

        return gulp.src(config.paths.src.sass.bootstrap)
            .pipe(plugins.changed(`${config.paths.output.vendor.css}`))
            .pipe(plugins.plumber())
            .pipe(plugins.sass())
            .pipe(plugins.if(!config.unicode, plugins.sassUnicode()))
            .pipe(plugins.autoprefixer())
            .pipe(plugins.concat(config.files.bootstrap))
            .pipe(plugins.cleanCss())
            .pipe(gulp.dest(`${config.paths.output.vendor.css}`));
    };
};