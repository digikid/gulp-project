const chalk = require(`chalk`);

module.exports = (gulp, plugins, config) => {
    return done => {

        if (config.debug) {
            console.log(`${chalk.bold(`Сборка HTML файлов...`)}`);
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

        const {
            title,
            description,
            mode,
            icomoon
        } = config;

        const { year } = config.now;

        return gulp.src(config.paths.src.html.root)
            .pipe(plugins.plumber())
            .pipe(plugins.fileInclude({
                prefix: `@@`,
                basepath: config.paths.src.html.partials,
                context: {
                    title,
                    description,
                    mode,
                    icomoon,
                    year
                }
            }))
            .pipe(plugins.inject(gulp.src(injects, {
                allowEmpty: true
            }), config.plugins.inject))
            .pipe(plugins.beautify.html(plugins.beautify.html))
            .pipe(gulp.dest(config.paths.output.root));
    };
};