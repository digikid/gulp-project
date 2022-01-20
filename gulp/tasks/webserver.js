const chalk = require('chalk');
const server = require('browser-sync');

const log = add('@gulp/core/log');

module.exports = (gulp, plugins, config) => {
    const {
        paths: {
            output,
            output: {
                root: baseDir
            }
        },
        plugins: {
            webserver:
            params
        },
        args: {
            open,
            abstract
        }
    } = config;

    const abstractPath = output.abstract.root.replace(`${baseDir}/`, '');

    const startPath = (abstract && open === 'index') ? `${abstractPath}` : `/${open}.html`;

    return done => {
        log(`${chalk.bold.green('Сборка файлов завершена.')}`);
        log(`${chalk.bold('Запуск веб-сервера...')}`);

        server.init({
            server: {
                baseDir
            },
            startPath,
            ...params
        });

        done();
    };
};