const chalk = require(`chalk`);

module.exports = (gulp, plugins, config) => {
    return done => {

        if (config.debug) {
            console.log(`${chalk.bold(`Сборка CSS файлов...`)}`);
        };

        const merge = config.merge.css;
        const minify = config.minify.css;
        const paths = config.paths.src.sass;

        const compileSass = (path, cb) =>
            gulp.src(path)
                .pipe(plugins.plumber())
                .pipe(plugins.if(config.sourcemaps, plugins.sourcemaps.init()))
                .pipe(plugins.sass(config.plugins.sass))
                .on(`error`, plugins.sass.logError)
                .pipe(plugins.base64(config.plugins.base64))
                .pipe(plugins.sassUnicode())
                .pipe(plugins.autoprefixer())
                .pipe(plugins.if(merge || (path !== paths.components), plugins.concat(config.files.css)))
                .pipe(plugins.groupCssMediaQueries())
                .pipe(plugins.if(minify, plugins.cleanCss(), plugins.cssbeautify()))
                .pipe(plugins.if(config.sourcemaps, plugins.sourcemaps.write()))
                .pipe(plugins.if(minify, plugins.rename((path) => {
                    path.basename += `.min`;
                })))
                .pipe(gulp.dest(config.paths.output.css))
                .on(`end`, cb);

        const compileSassAll = cb => compileSass(paths.root, cb);
        const compileSassBase = cb => compileSass(paths.base, cb);
        const compileSassComponents = cb => compileSass(paths.components, cb);

        const tasks = merge ? [compileSassAll] : [compileSassBase, compileSassComponents];

        gulp.parallel(...tasks)(done);
    };
};