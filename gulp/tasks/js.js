module.exports = (gulp, plugins, config) => {
    return done => {

        const jsCompiler = (path, merge, cb) =>
            gulp.src(path)
                .pipe(plugins.changed(config.paths.output.js))
                .pipe(plugins.plumber())
                .pipe(plugins.fileInclude({
                    prefix: `@@`,
                    basepath: config.paths.src.js.partials,
                    context: {
                        title: config.title,
                        name: config.name
                    }
                }))
                .pipe(plugins.if(config.sourcemaps, plugins.sourcemaps.init()))
                .pipe(plugins.if(merge, plugins.concat(config.files.js)))
                .pipe(plugins.if(config.minify.js, plugins.uglify(), plugins.beautify.js({
                    indent_size: 4,
                    max_preserve_newlines: 2
                })))
                .pipe(plugins.if(config.minify.js, plugins.rename((path) => {
                    path.basename += `.min`;
                })))
                .pipe(plugins.if(config.sourcemaps, plugins.sourcemaps.write()))
                .pipe(gulp.dest(config.paths.output.js))
                .on(`end`, cb);

        const compileJsAll = cb => jsCompiler([config.paths.src.js.base, config.paths.src.js.components], true, cb);
        const compileJsBase = cb => jsCompiler(config.paths.src.js.base, true, cb);
        const compileJsComponents = cb => jsCompiler(config.paths.src.js.components, false, cb);

        const tasks = config.merge ? [compileJsAll] : [compileJsBase, compileJsComponents];

        gulp.parallel(...tasks)(done);
    };
};