const chalk = require('chalk');

const { task } = add('@gulp/utils/args');
const { defineName } = add('@gulp/utils/function');

const log = add('@gulp/core/log');

module.exports = (gulp, plugins, config) => {
    return done => {
        const {
            paths: {
                root
            },
            zip
        } = config;

        const { zip: compress } = plugins;

        log(chalk.bold('Создание ZIP-архивов...'));

        const createZipFile = ({ name, src, dest }) => defineName(`zip: [${name}]`, done => {
            const output = (task === 'zip') ? root : dest;

            return gulp.src([...src, `!./**/*.zip`], {
                dot: true
            })
                .pipe(compress(name))
                .pipe(gulp.dest(output))
                .on('end', done);
        });

        const compile = Object.values(zip).map(createZipFile);

        const tasks = (task === 'zip') ? ['build', ...compile] : [...compile];

        return gulp.series(...tasks)(done);
    };
};