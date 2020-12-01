const upload = require(`vinyl-ftp`);
const log = require(`fancy-log`);
const chalk = require(`chalk`);

module.exports = (gulp, plugins, config) => {
    return done => {

        const {ftp, host: ftpHost} = config;
        const {host, user, password, dest} = ftp[ftpHost];

        const deploy = config.paths.deploy;
        const path = config.main ? deploy.main : deploy.source;

        if (config.debug) {
            if (config.main) {
                const resolutions = path.replace(`./dist/**/*.{`, ``).replace(`}`, ``).split(`,`).map(resolution => `.${resolution}`).join(`, `);

                console.log(`${chalk.bold.bgYellowBright(`Выборочная загрузка`)}\nТак как установлен параметр [${chalk.bold.blue(`main`)}], будут загружены только файлы с разрешениями ${chalk.bold(resolutions)}.\nУстановить тип файлов для выборочной загрузки можно в параметре [${chalk.bold.blue(`config.paths.deploy.main`)}].`);
            };

            console.log(chalk.bold(`Загрузка файлов на сервер ${host}...`));
        };

        return gulp.src(path, {
                base: deploy.base,
                buffer: false
            })
            .pipe(upload
                .create({
                    host: host,
                    user: user,
                    password: password,
                    parallel: 1,
                    log: log
                })
                .dest(dest)
            );
    };
};