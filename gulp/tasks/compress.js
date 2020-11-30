const fs = require(`fs`);
const del = require(`del`);
const chalk = require(`chalk`);

module.exports = (gulp, plugins, config) => {
    return done => {

        if (!config.compress) {
            done();
            return;
        };

        const output = {
            css: config.paths.output.css,
            js: config.paths.output.js,
            vendor: {
                css: config.paths.output.vendor.css,
                js: config.paths.output.vendor.js
            }
        };

        const minified = {
            css: `${output.css}/${config.files.css.split(`.`)[0]}.min.css`,
            js: `${output.js}/${config.files.js.split(`.`)[0]}.min.js`
        };

        const paths = {
            polyfills: [
                `${output.js}/${config.files.polyfills}`,
            ],
            vendor: {
                css: [
                    `${output.vendor.css}/${config.files.bootstrap}`,
                    `${output.vendor.css}/**/*.css`
                ],
                js: [
                    `${output.vendor.js}/**/jquery.min*.js`,
                    `${output.vendor.js}/**/*.js`
                ]
            },
            output: {
                css: [
                    `${config.paths.output.css}/${config.files.css}`,
                    `${config.paths.output.css}/**/*.css`,
                    `!${minified.css}`
                ],
                js: [
                    `${output.js}/${config.files.js}`,
                    `${output.js}/**/*.js`,
                    `!${minified.js}`
                ]
            }
        };

        if (currentWatcher) {
            try {
                if (fs.existsSync(minified[currentWatcher])) {
                    del(minified[currentWatcher]);
                };
            } catch(e) {
                console.error(e)
            };
        };

        const compress = (ext, cb) => {
            const path = ext === `css` ? [...paths.vendor.css, ...paths.output.css] : config.babel ? [...paths.output.js] : [...paths.polyfills, ...paths.vendor.js, ...paths.output.js];

            if (config.debug) {
                console.log(`${chalk.bold(`Компрессия ${ext.toUpperCase()} файлов...`)}`);
            };

            gulp.src(path)
                .pipe(plugins.plumber())
                .pipe(plugins.concat(config.files[ext]))
                .pipe(plugins.if(ext === `css`, plugins.cleanCss(config.plugins.cleanCss), plugins.terser(config.plugins.terser)))
                .pipe(plugins.rename(path => {
                    path.basename += `.min`;
                }))
                .pipe(gulp.dest(config.paths.output[ext]))
                .on(`end`, cb);
        };

        const compressCSS = cb => compress(`css`, cb);
        const compressJS = cb => compress(`js`, cb);

        const remove = (ext, cb) => del([
            `${config.paths.output[ext]}/**/*.${ext}`,
            `!${minified[ext]}`
        ]);

        const removeCSS = cb => remove(`css`, cb);
        const removeJS = cb => remove(`js`, cb);

        let tasks = [];

        if (currentWatcher === `sass`) {
            tasks = [compressCSS, removeCSS];
        } else if (currentWatcher === `js`) {
            tasks = [compressJS, removeJS];
        } else {
            tasks = [compressCSS, removeCSS, compressJS, removeJS];
        };

        gulp.series(...tasks)(done);
    };
};