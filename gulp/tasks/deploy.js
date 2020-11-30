const chalk = require(`chalk`);

module.exports = (gulp, plugins, config) => done => {
    const {ftp, host} = config;

    if (!ftp[host].host) {
        done();
        return;
    };

    if (config.debug) {
        console.log(`${chalk.bold(`Загрузка файлов на сервер ${ftp[host].host}...`)}`);
    };

    gulp.series(
        `build`,
        `upload`,
        `browser`
    )(done);
};