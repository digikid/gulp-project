const chalk = require('chalk');

const log = add('@gulp/core/log');

const { concatGulp } = add('@gulp/utils/tasks');

module.exports = (gulp, plugins, config) => {
    return done => {
        log(chalk.bold('Добавление иконок в проект...'));

        const tasks = [
            'json',
            'sass',
            'fonts'
        ];

        concatGulp('icomoon', tasks, done);
    };
};
