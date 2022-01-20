const chalk = require('chalk');

const log = add('@gulp/core/log');

module.exports = (gulp, plugins, config) => {
    const { cache } = plugins;

    return done => {
        log(chalk.bold('Очистка кеша...'));

        cache.clearAll(() => {
            log(chalk.bold('Кеш очищен.'));

            done();
        });
    };
};