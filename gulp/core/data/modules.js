const { trimExt, trimBefore } = add('@gulp/utils/path');
const { findDeep } = add('@gulp/utils/object');
const { findByValue } = add('@gulp/utils/array');
const { capitalize } = add('@gulp/utils/string');
const { scanDirectory } = add('@gulp/utils/fs');

const config = add('@gulp/core/config');

module.exports = () => {
    const {
        paths,
        modules
    } = config;

    const modulesPostfix = `.${modules.postfix}`;

    const tree = scanDirectory(`${paths.src.root}`, {
        depth: 10,
        extensions: ['scss', 'sass', 'js']
    });

    const files = findDeep(tree, ({ type, name }) => (type === 'file' && name.includes(modulesPostfix))).map(file => {
        const type = /\.(scss|sass)/.test(file.name) ? 'css' : 'js';

        const minPostfix = modules.minify[type] ? '.min' : '';
        const baseName = trimExt(file.name.replace(modulesPostfix, ''));

        const title = capitalize(baseName);
        const name = `${baseName}${minPostfix}.${type}`;
        const path = `${paths.output[type]}/${name}`.replace(paths.output.root, '..');

        return {
            name,
            path,
            type,
            title
        };
    });

    const cssModules = findByValue(files, 'type', 'css');
    const jsModules = findByValue(files, 'type', 'js');

    const arr = ([...new Set(files.map(({ title }) => title))]).map(title => {
        const type = 'module';

        const css = {
            name: null,
            path: null
        };

        const js = {
            name: null,
            path: null
        };

        const cssFile = cssModules.find(file => file.title === title);
        const jsFile = jsModules.find(file => file.title === title);

        if (cssFile) {
            css.name = cssFile.name;
            css.path = cssFile.path;
        };

        if (jsFile) {
            js.name = jsFile.name;
            js.path = jsFile.path;
        };

        return {
            title,
            type,
            css,
            js
        };
    });

    return arr;
};