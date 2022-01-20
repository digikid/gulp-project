const chalk = require('chalk');

const { defineName } = add('@gulp/utils/function');
const { removeLastSlash } = add('@gulp/utils/path');

const log = add('@gulp/core/log');

module.exports = (gulp, plugins, config) => {
    return done => {
        const { name, paths } = config;
        const { zip } = plugins;

        log(chalk.bold('Создание ZIP-архивов...'));

        const createZipFile = path => {
            const type = (/[^/]*$/).exec(removeLastSlash(path))[0];
            const fileName = `${name}-${type}.zip`;

            return defineName(`zip: [${fileName}]`, cb => {
                if (!type) return cb;

                gulp.src([`${path}/**`, `!${path}/*.zip`])
                    .pipe(zip(fileName))
                    .pipe(gulp.dest(paths.output.root))
                    .on('end', cb);
            });
        };

        const tasks = [...new Set(paths.zip)].map(createZipFile);

        return gulp.series('build', ...tasks)(done);
    };
};