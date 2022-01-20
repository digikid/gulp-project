const chalk = require('chalk');
const server = require('browser-sync').create();

const { scanDirectory, createDirectory } = add('@gulp/utils/fs');
const { launchChrome, launchLighthouse } = add('@gulp/utils/lighthouse');

const { browser: app } = add('@gulp/utils/os');

module.exports = (gulp, plugins, config) => {
    const {
        paths: {
            output: {
                root: output
            }
        },
        args: {
            open
        },
        plugins: {
            lighthouse: {
                path,
                port
            }
        }
    } = config;

    const tree = scanDirectory(output, {
        depth: 1,
        extensions: ['html']
    });

    const files = (open === 'index') ? tree.filter(({ name, type }) => (type === 'file' && name.endsWith('.html'))).map(({ name }) => name) : [`${open}.html`];

    const serverParams = {
        server: output,
        port,
        notify: false,
        open: false,
        cors: true
    };

    return done => {
        console.log(`${chalk.bold('Запуск сборки файлов...')}`);

        const reports = async cb => {
            console.log(`${chalk.bold.green('Сборка файлов завершена.')}`);
            console.log(`${chalk.bold('Генерация отчетов PageSpeed Insights...')}\nОжидайте, в зависимости от количества страниц и ресурсов компьютера задача может занять продолжительное время.`);

            await createDirectory(path);

            server.init(serverParams);

            const chrome = await launchChrome();

            try {
                for (const file of files) {
                    const uri = await launchLighthouse(file);

                    gulp.src(__filename).pipe(plugins.open({
                        uri,
                        app
                    }));
                };
            } catch(e) {
                console.log(`${chalk.bold.whiteBright.bgRedBright('Не удалось сформировать отчет')}\nПри формировании отчета для файла ${chalk.italic.black.bgWhiteBright(file)} произошла ошибка, попробуйте повторить позже.`);
            };

            await chrome.kill();

            server.exit();

            console.log(`${chalk.bold.green('Все отчеты готовы.')}`);

            cb();
        };

        gulp.series('build', reports)(done);
    };
};
