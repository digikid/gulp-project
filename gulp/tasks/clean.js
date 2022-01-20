const del = require('del');
const chalk = require('chalk');

const log = add('@gulp/core/log');

module.exports = (gulp, plugins, config) => {
    const { paths: { clean: path } } = config;

    return done => {
        log(`${chalk.bold('Очистка временных директорий...')}`);

        (async () => {
            await del(path);

            done();
        })();
    };
};