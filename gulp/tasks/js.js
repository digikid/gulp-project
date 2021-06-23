const del = require(`del`);
const chalk = require(`chalk`);

const browserify = require(`browserify`);
const babelify = require(`babelify`);
const source = require(`vinyl-source-stream`);
const buffer = require(`vinyl-buffer`);

module.exports = (gulp, plugins, config) => {
    return done => {

        if (config.debug) {
            console.log(`${chalk.bold(`Сборка JS файлов...`)}`);
        };

        const merge = config.merge.js;
        const minify = config.minify.js;

        const paths = {
            base: config.paths.src.js.base,
            components: config.paths.src.js.components,
            polyfills: config.paths.src.js.polyfills
        };

        const removeJS = (path, cb) => del(path);

        const compileJsPolyfills = cb => {
            gulp.src(paths.polyfills)
                .pipe(plugins.changed(config.paths.output.js))
                .pipe(plugins.plumber())
                .pipe(plugins.concat(config.files.polyfills))
                .pipe(plugins.if(!config.compress, plugins.terser(config.plugins.terser)))
                .pipe(gulp.dest(config.paths.output.js))
                .on(`end`, cb);
        };

        const compileJs = (path, cb) => {
            gulp.src(path)
                .pipe(plugins.changed(config.paths.output.js))
                .pipe(plugins.plumber())
                .pipe(plugins.fileInclude({
                    prefix: `@@`,
                    basepath: config.paths.src.js.partials,
                    context: {
                        config
                    }
                }))
                .pipe(plugins.if(config.sourcemaps && !minify, plugins.sourcemaps.init()))
                .pipe(plugins.if(merge || (path !== paths.components), plugins.concat(config.files.js)))
                .pipe(plugins.beautify.js(config.plugins.beautify.js))
                .pipe(plugins.if(config.sourcemaps && !minify, plugins.sourcemaps.write()))
                .pipe(gulp.dest(config.paths.output.js))
                .on(`end`, cb);
        };

        const babelifyJs = cb => {
            browserify([`${config.paths.output.js}/${config.files.js}`])
                .transform(babelify.configure(config.plugins.babelify), {
                    global: true,
                    ignore: [/\/node_modules\/(core-js|regenerator-runtime)\//]
                })
                .bundle()
                .pipe(source(config.files.js))
                .pipe(buffer())
                .pipe(gulp.dest(config.paths.output.js))
                .on(`end`, cb);
        };

        const minifyJs = cb => {
            gulp.src([`${config.paths.output.js}/**/*.js`, `!${config.paths.output.js}/${config.files.polyfills}`])
                .pipe(plugins.plumber())
                .pipe(plugins.if(config.sourcemaps, plugins.sourcemaps.init()))
                .pipe(plugins.terser(config.plugins.terser))
                .pipe(plugins.if(config.sourcemaps, plugins.sourcemaps.write()))
                .pipe(plugins.rename(path => {
                    path.basename += `.min`;
                }))
                .pipe(gulp.dest(config.paths.output.js))
                .on(`end`, cb);
        };

        const compileJsAll = cb => compileJs([...paths.base, paths.components], cb);
        const compileJsBase = cb => compileJs(paths.base, cb);
        const compileJsComponents = cb => compileJs(paths.components, cb);

        const removeUnminifiedJS = cb => removeJS([
            `${config.paths.output.js}/**/*.js`,
            `!${config.paths.output.js}/**/*.min.js`
        ]);

        let tasks = [];

        if (config.babel) {
            tasks = [compileJsAll, babelifyJs];
        } else {
            tasks = [compileJsPolyfills];

            if (merge) {
                tasks = [...tasks, compileJsAll];
            } else {
                tasks = [...tasks, compileJsBase, compileJsComponents];
            };
        };

        if (minify) {
            tasks = [...tasks, minifyJs, removeUnminifiedJS];
        };

        gulp.series(...tasks)(done);
    };
};