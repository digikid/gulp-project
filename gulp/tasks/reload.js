const server = require('browser-sync');
const chalk = require('chalk');

const log = add('@gulp/core/log');

module.exports = (gulp, plugins, config) => {
    return done => {
        log(`${chalk.bold('Перезагрузка страницы...')}`);

        server.reload();

        done();
    };
};