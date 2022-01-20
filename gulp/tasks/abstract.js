const chalk = require('chalk');

const log = add('@gulp/core/log');

const { concatGulp } = add('@gulp/utils/tasks');

module.exports = (gulp, plugins, config) => {
    return done => {
        log(`${chalk.bold('Генерация списка страниц проекта...')}`);

        const tasks = [
            'html',
            'css',
            'images'
        ];

        concatGulp('abstract', tasks, done);
    };
};