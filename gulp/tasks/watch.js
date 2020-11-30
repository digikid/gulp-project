const chalk = require(`chalk`);

module.exports = (gulp, plugins, config) => {
    return done => {

        if (config.debug) {
            console.log(`${chalk.bold(`Запуск слежения за обновлением файлов...`)}`);
        };

        const watchers = [{
            name: `html`,
            path: config.paths.watch.html,
            tasks: [`html`, `common`]
        }, {
            name: `pug`,
            path: config.paths.watch.pug,
            tasks: [`pug`, `common`]
        }, {
            name: `img`,
            path: config.paths.watch.img,
            tasks: [`images`]
        }, {
            name: `steady`,
            path: config.paths.watch.steady,
            tasks: [`steady`]
        }, {
            name: `icomoon`,
            path: config.paths.watch.icomoon,
            tasks: [`icomoon`]
        }, {
            name: `common`,
            path: config.paths.watch.common,
            tasks: [`common`]
        }, {
            name: `sass`,
            path: config.paths.watch.sass.root,
            tasks: [`sass`, `compress`, `common`]
        }, {
            name: `bootstrap`,
            path: config.paths.watch.sass.bootstrap,
            tasks: [`bootstrap`, `compress`]
        }, {
            name: `js`,
            path: config.paths.watch.js,
            tasks: [`js`, `compress`, `common`]
        }, {
            name: `vectors`,
            path: config.paths.watch.vectors,
            tasks: [`sass`, `compress`]
        }, {
            name: `vendor`,
            path: config.paths.watch.vendor,
            tasks: [`vendor`, `compress`, `common`]
        }];

        const events = {};

        watchers.forEach(watcher => {
            events[watcher.name] = cb => {
                currentWatcher = watcher.name;
                cb();
            };
            Object.assign(events[watcher.name], {
                displayName: `watch`
            });
        });

        watchers.forEach(watcher => gulp.watch(watcher.path, gulp.series(events[watcher.name], ...watcher.tasks, `reload`)));

        if (config.debug) {
            console.log(`${chalk.bold.green(`Сборка проекта закончена.`)}`);
        };
    };
};