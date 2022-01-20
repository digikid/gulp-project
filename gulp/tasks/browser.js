const chalk = require('chalk');

const log = add('@gulp/core/log');

const { browser: app } = add('@gulp/utils/os');

const { removeLastSlash } = add('@gulp/utils/path');

module.exports = (gulp, plugins, config) => {
    const {
        paths: {
            output
        },
        args: {
            host,
            open,
            abstract
        },
        ftp
    } = config;

    const path = removeLastSlash(ftp[host].uri);

    let uri = (open === 'index') ? path : `${path}/${open}.html`;

    const abstractPath = output.abstract.root.replace(`${output.root}/`, '');

    if (open === 'index') {
        if (abstract) {
            uri = `${path}/${abstractPath}`;
        } else {
            uri = path;
        };
    } else {
        uri = `${path}/${open}.html`;
    };

    return done => {
        log(chalk.bold(`Открываю страницу ${chalk.italic(uri)} в браузере...`));

        return gulp.src(__filename)
            .pipe(plugins.open({
                uri,
                app
            }))
            .on('end', done);
    };
};