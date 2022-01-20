const chalk = require('chalk');

const log = add('@gulp/core/log');

module.exports = (gulp, plugins, config) => {
    const {
        paths: {
            src: {
                images: src
            },
            output: {
                images: dest
            }
        },
        plugins: params,
        args
    } = config;

    const {
        if: _if,
        plumber,
        changed,
        cache,
        webp,
        image
    } = plugins;

    return done => {
        log(`${chalk.bold('Оптимизация и сжатие изображений...')}`);

        return gulp.src(src)
            .pipe(changed(dest))
            .pipe(plumber())
            .pipe(_if(args.webp, webp()))
            .pipe(image(params.image))
            .pipe(gulp.dest(dest))
            .on('end', done);
    };
};