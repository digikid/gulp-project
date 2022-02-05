const chalk = require('chalk');

const log = add('@gulp/core/log');

const { concatGulp } = add('@gulp/utils/tasks');

module.exports = (gulp, plugins, config) => {
    const {
        abstract: {
            zip
        }
    } = config;

    return done => {
        log(`${chalk.bold('Генерация списка страниц проекта...')}`);

        const build = done => concatGulp('abstract', [
            'html',
            'css',
            'images'
        ], done);

        const tasks = zip ? ['zip', build] : [build];

        return gulp.series(...tasks)(done);
    };
};