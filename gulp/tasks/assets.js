const chalk = require('chalk');

const log = add('@gulp/core/log');

module.exports = (gulp, plugins, config) => {
    const {
        paths: {
            src: {
                root: base,
                assets: src
            },
            output: {
                root: dest
            }
        }
    } = config;

    return done => {
        log(`${chalk.bold('Копирование статических файлов...')}`);

        const params = {
            base
        };

        return gulp.src(src, params).pipe(gulp.dest(dest)).on('end', done);
    };
};