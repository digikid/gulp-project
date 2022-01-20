const chalk = require('chalk');

const log = add('@gulp/core/log');

const { scanDirectory } = add('@gulp/utils/fs');
const { trimExt } = add('@gulp/utils/path');
const { getHtmlImport } = add('@gulp/utils/string');

module.exports = (gulp, plugins, config) => {
    const {
        paths: {
            src,
            output,
            output: {
                html: dest
            }
        },
        args: {
            minify
        },
        modules: {
            postfix
        },
        plugins: params,
        files,
        injects
    } = config;

    const {
        plumber,
        beautify,
        replace
    } = plugins;

    return done => {
        log(`${chalk.bold('Встраивание CSS и JS файлов...')}`);

        const data = {};
        const regex = {};
        const extensions = [];

        Object.keys(injects).forEach(type => {
            data[type] = {};
            regex[type] = {};

            Object.keys(injects[type]).forEach(extension => {
                const reg = injects[type][extension];

                data[type][extension] = '';
                regex[type][extension] = new RegExp(`(\<\!-- ${reg} --\>)(.*)(\<\!-- \/${reg} --\>)`, 'gis');

                if (!extensions.includes(extension)) {
                    extensions.push(extension);
                };
            });
        });

        extensions.forEach(extension => {
            const path = output[extension].replace(`${output.root}/`, '');
            const fileName = `${files.main[extension]}${minify[extension] ? '.min' : ''}.${extension}`;

            const outputTree = scanDirectory(output[extension], {
                depth: 1
            });

            const main = getHtmlImport(extension, `${path}/${fileName}`);
            const modules = outputTree.filter(({ type, name }) => (type === 'file') && (name !== fileName) && !name.includes('.map')).reduce((acc, { name }) => acc + getHtmlImport(extension, `${path}/${name}`), '');

            data.main[extension] = main;
            data.modules[extension] = modules;
        });

        return gulp.src(`${dest}/*.html`)
            .pipe(plumber())
            .pipe(replace(regex.main.css, `\$1${data.main.css}\$3`))
            .pipe(replace(regex.modules.css, `\$1${data.modules.css}\$3`))
            .pipe(replace(regex.main.js, `\$1${data.main.js}\$3`))
            .pipe(replace(regex.modules.js, `\$1${data.modules.js}\$3`))
            .pipe(replace('><!-', '>\n<!-'))
            .pipe(beautify.html(params.beautify.html))
            .pipe(gulp.dest(dest))
            .on('end', done);
    };
};
