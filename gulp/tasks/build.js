const chalk = require(`chalk`);

module.exports = (gulp, plugins, config) => {
    if (config.debug) {
        if (config.force) {
            console.log(`${chalk.bold.bgYellowBright(`Сборка пропущена`)}\nТак как установлен параметр [${chalk.bold.blue(`force`)}], повторная сборка файлов была пропущена.`);
        } else {
            console.log(`${chalk.bold(`Запуск сборки...`)}`);
        };
    };

    let tasks = [
        `clean`,
        `icomoon`,
        `bootstrap`,
        `sass`,
        `vendor`,
        `js`,
        `compress`,
        `images`,
        `steady`,
        `html`,
        `pug`,
        `zip`,
        `common`
    ];

    if (config.main && !config.paths.deploy.main.includes(`.jpg`)) {
        tasks = tasks.filter(task => task !== `images`);
    };

    if (!config.zip) {
        tasks = tasks.filter(task => task !== `zip`);
    };

    return gulp.series(...tasks);
};