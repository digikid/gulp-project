const upload = require('vinyl-ftp');
const fancyLog = require('fancy-log');
const chalk = require('chalk');

const log = add('@gulp/core/log');

module.exports = (gulp, plugins, config) => {
    const {
        paths: {
            output: {
                root: base
            },
            deploy
        },
        args: {
            host: ftpHost,
            force
        },
        ftp
    } = config;

    const {
        host,
        user,
        password,
        port,
        dest
    } = ftp[ftpHost];

    const path = force.length ? force.reduce((acc, path) => {
        if (path in deploy.force) {
            acc.push(deploy.force[path]);
        };

        return acc;
    }, []) : deploy.source;

    return done => {
        if (force) {
            log(`${chalk.bold.bgYellowBright('Выборочная загрузка файлов')}\nТак как установлен параметр [${chalk.bold.blue('force')}], файлы будут загружены выборочно.`);
        };

        log(chalk.bold(`Загрузка файлов на сервер ${host}...`));

        const buffer = false;
        const parallel = 1;

        const src = {
            base,
            buffer
        };

        const params = {
            host,
            user,
            password,
            port,
            parallel,
            log: fancyLog
        };

        return gulp.src(path, src).pipe(upload.create(params).dest(dest));
    };
};