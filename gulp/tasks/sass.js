module.exports = (gulp, plugins, config) => {
    return done => {

        const sassCompiler = (path, merge, cb) =>
            gulp.src(path)
            .pipe(plugins.plumber())
            .pipe(plugins.if(config.sourcemaps, plugins.sourcemaps.init()))
            .pipe(plugins.sass({
                outputStyle: `expanded`,
                errLogToConsole: true
            }))
            .on(`error`, plugins.sass.logError)
            .pipe(plugins.base64({
                exclude: [
                    `/sprite/`,
                    `/images/`,
                    `/symbols/`,
                    `/vendor/`
                ]
            }))
            .pipe(plugins.sassUnicode())
            .pipe(plugins.autoprefixer())
            .pipe(plugins.if(merge, plugins.concat(config.files.css)))
            .pipe(plugins.groupCssMediaQueries())
            .pipe(plugins.if(config.minify.css, plugins.cleanCss(), plugins.cssbeautify()))
            .pipe(plugins.if(config.minify.css, plugins.rename((path) => {
                path.basename += `.min`;
            })))
            .pipe(plugins.if(config.sourcemaps, plugins.sourcemaps.write()))
            .pipe(gulp.dest(config.paths.output.css))
            .on(`end`, cb);

        const compileSassAll = cb => sassCompiler(config.paths.src.sass.root, true, cb);
        const compileSassBase = cb => sassCompiler(config.paths.src.sass.base, true, cb);
        const compileSassComponents = cb => sassCompiler(config.paths.src.sass.components, false, cb);

        const tasks = config.merge ? [compileSassAll] : [compileSassBase, compileSassComponents];

        gulp.parallel(...tasks)(done);
    };
};