const fs = require(`fs`);
const path = require(`path`);
const chalk = require(`chalk`);

module.exports = (gulp, plugins, config) => {
    return done => {

        if (config.debug) {
            console.log(`${chalk.bold(`Компиляция Pug файлов...`)}`);
        };

        const paths = {
            polyfills: [
                `${config.paths.output.js}/${config.files.polyfills}`
            ],
            vendor: {
                css: [
                    `${config.paths.output.vendor.css}/**/${config.files.bootstrap}`,
                    `${config.paths.output.vendor.css}/**/*.css`
                ],
                js: [
                    `${config.paths.output.vendor.js}/**/jquery.min*.js`,
                    `${config.paths.output.vendor.js}/**/*.js`
                ],
            },
            output: {
                css: [
                    `${config.paths.output.css}/${config.files.css.split(`.`)[0]}*.css`,
                    `${config.paths.output.css}/**/*.css`
                ],
                js: [
                    `${config.paths.output.js}/${config.files.js.split(`.`)[0]}*.js`,
                    `${config.paths.output.js}/**/*.js`
                ]
            }
        };

        const injects = config.compress ? [...paths.output.css, ...paths.output.js] : config.babel ? [...paths.vendor.css, ...paths.output.css, ...paths.output.js] : [...paths.polyfills, ...paths.vendor.css, ...paths.vendor.js, ...paths.output.css, ...paths.output.js];

        const mergeJson = cb => {
            return gulp.src(`${config.paths.src.data}/**/*.json`)
                .pipe(plugins.plumber())
                .pipe(plugins.mergeJson({
                    fileName: `data.json`,
                    edit: (json, file) => {
                        const filename = path.basename(file.path);
                        const primaryKey = filename.replace(path.extname(filename), ``);

                        return {
                            [primaryKey]: json
                        };
                    }
                }))
                .pipe(gulp.dest(config.paths.temp))
                .on(`end`, cb);
        };

        const compilePug = cb =>
            gulp.src(config.paths.src.pug.root)
                .pipe(plugins.plumber())
                .pipe(plugins.data(() => JSON.parse(fs.readFileSync(`${config.paths.temp}/data.json`))))
                .pipe(plugins.pug({
                    pretty: true,
                    locals: config
                }))
                .pipe(plugins.fileInclude({
                    prefix: `@@`,
                    basepath: config.paths.src.pug.partials,
                    context: {
                        title: config.title,
                        year: config.now.year,
                        mode: config.mode,
                        icomoon: config.icomoon
                    }
                }))
                .pipe(plugins.inject(gulp.src(injects, {
                    allowEmpty: true
                }), config.plugins.inject))
                .pipe(plugins.beautify.html(plugins.beautify.html))
                .pipe(gulp.dest(config.paths.output.root))
                .on(`end`, cb);

        const tasks = [mergeJson, compilePug];

        return gulp.series([...tasks])(done);

    };
};
