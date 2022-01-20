const chalk = require('chalk');

const log = add('@gulp/core/log');

module.exports = (gulp, plugins, config) => {
    const {
        paths: {
            watch: paths
        },
        args: {
            abstract
        }
    } = config;

    return done => {
        log(`${chalk.bold('Запуск слежения за обновлением файлов...')}`);

        const tasks = {
            html: ['html', 'sync', 'inject'],
            sass: ['css', 'sync', 'inject'],
            js: ['js', 'sync', 'inject'],
            images: ['images'],
            assets: ['assets'],
            icomoon: ['icomoon'],
            abstract: ['abstract'],
            vectors: ['css']
        };

        if (abstract) {
            ['html', 'js', 'sass'].forEach(task => {
                tasks[task].push('abstract');
            });
        };

        Object.entries(tasks).forEach(([id, tasks]) => gulp.watch(paths[id], gulp.series(...tasks, 'reload')));
    };
};