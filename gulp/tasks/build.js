const chalk = require('chalk');

const log = add('@gulp/core/log');

module.exports = (gulp, plugins, config) => {
    const { paths, args } = config;
    const { force } = args;

    if (force.length) {
        log(`${chalk.bold.green('Режим быстрой сборки')}\nПараметр [${chalk.bold.blue('force')}] определен, поэтому будут выполнены только выбранные задачи [${chalk.bold.magenta(force.join(', '))}].`);
    };

    let queue = [
        'clean',
        'icomoon',
        'css',
        'js',
        'images',
        'assets',
        'html',
        'inject',
        'abstract'
    ];

    const tasks = queue.filter(task => {
        if (task === 'clean' || task === 'inject') return true;

        if (task in args && !args[task]) {
            return false;
        };

        if (force.length) {
            return force.includes(task);
        };

        return true;
    });

    log(chalk.bold('Запуск сборки файлов...'));

    return gulp.series(...tasks);
};