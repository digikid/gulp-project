const chalk = require(`chalk`);

module.exports = (gulp, plugins, config) => done => {
    const {ftp, host} = config;

    if (!ftp[host].host) {
        done();
        return;
    };

    if (config.debug) {
        if (config.force) {
            console.log(`${chalk.bold.bgYellowBright(`Сборка пропущена`)}\nТак как установлен параметр [${chalk.bold.blue(`force`)}], повторная сборка файлов была пропущена.`);
        } else {
            console.log(`${chalk.bold(`Подготовка файлов перед загрузкой...`)}`);
        };
    };

    const tasks = config.force ? [`upload`, `browser`] : [`build`, `upload`, `browser`];

    gulp.series(...tasks)(done);
};