const del = require(`del`);

module.exports = (gulp, plugins, config) => {
    return done => {

        if (!config.compress) {
            done();
            return;
        };

        const path = {
            js: [
                `${config.paths.output.js}/${config.files.polyfills}`,
                `${config.paths.output.vendor.root}/**/jquery.min*.js`,
                `${config.paths.output.vendor.root}/**/*.js`,
                `${config.paths.output.js}/**/*.js`,
                `${config.paths.output.js}/${config.files.js.split(`.`)[0]}*.js`
            ],
            css: [
                `${config.paths.output.vendor.css}/${config.files.bootstrap}`,
                `${config.paths.output.vendor.root}/**/*.css`,
                `${config.paths.output.css}/**/*.css`,
                `${config.paths.output.css}/${config.files.css.split(`.`)[0]}*.css`
            ]
        };

        const compress = (ext, cb) => {
            gulp.src(path[ext])
                .pipe(plugins.plumber())
                .pipe(plugins.concat(config.files[ext]))
                .pipe(plugins.if(ext === 'js', plugins.terser({
                    output: {
                        comments: false
                    }
                }), plugins.cleanCss()))
                .pipe(plugins.rename(path => {
                    path.basename += `.min`;
                }))
                .pipe(gulp.dest(config.paths.output[ext]))
                .on(`end`, cb);
        };

        const remove = (ext, cb) =>
            del([
                ...path[ext],
                `!${config.paths.output.vendor[ext]}/**/*.${ext}`,
                `!${config.paths.output[ext]}/${config.files[ext].split(`.`)[0]}.min.${ext}`
            ]);

        const compressCSS = cb => compress('css', cb);
        const compressJS = cb => compress('js', cb);

        const removeCSS = cb => remove('css');
        const removeJS = cb => remove('js');

        const tasks = [compressCSS, compressJS, removeCSS, removeJS];

        gulp.series(...tasks)(done);
    };
};
