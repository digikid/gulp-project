const chalk = require('chalk');
const del = require('del');

const log = add('@gulp/core/log');

const { scanDirectory } = add('@gulp/utils/fs');
const { findDeep } = add('@gulp/utils/object');
const { trimExt } = add('@gulp/utils/path');

module.exports = (gulp, plugins, config) => {
    const {
        paths: {
            src,
            output
        },
        files: {
            main
        },
        modules: {
            postfix
        }
    } = config;

    return done => {
        log(chalk.bold('Синхронизация файлов...'));

        const types = ['css', 'js', 'html'];

        (async () => {
            const files = [];

            types.forEach(type => {
                const sourceTypes = (type === 'css') ? ['sass', 'scss'] : [type];
                const outputType = type;

                const sourceDest = (type === 'css') ? 'sass' : type;
                const outputDest = type;

                const { root: sourceRoot } = src[sourceDest];
                const outputRoot = output[outputDest];

                const sourceTree = scanDirectory(sourceRoot, {
                    depth: 10
                });

                const outputTree = scanDirectory(outputRoot, {
                    depth: 1
                });

                const sourceFiles = findDeep(sourceTree, ({ name, type, extension }) => (type === 'file') && sourceTypes.includes(extension)).map(({ name }) => trimExt(name.replace(`.${postfix}`, '')));
                const outputFiles = outputTree.filter(({ name, type }) => (type === 'file' && name.endsWith(`.${outputType}`))).map(({ name }) => trimExt(name));

                const removeFiles = outputFiles.filter(file => {
                    if (type in main && main[outputType] === file) {
                        return false;
                    };

                    return !sourceFiles.includes(file);
                }).map(file => `${outputRoot}/${file}.${outputType}`);

                files.push(...removeFiles);
            });

            if (files.length) {
                await del(files);
            };

            done();
        })();
    };
};
