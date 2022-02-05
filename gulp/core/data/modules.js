const { trimExt, trimBefore } = add('@gulp/utils/path');
const { findDeep } = add('@gulp/utils/object');
const { findByValue } = add('@gulp/utils/array');
const { capitalize } = add('@gulp/utils/string');
const { scanDirectory } = add('@gulp/utils/fs');

const config = add('@gulp/core/config');

module.exports = () => {
    const {
        paths,
        modules: {
            postfix
        }
    } = config;

    const tree = scanDirectory(`${paths.src.root}`, {
        depth: 10,
        extensions: ['scss', 'sass', 'js']
    });

    const files = findDeep(tree, ({ type, name }) => (type === 'file' && name.includes(`.${postfix}`))).map(file => {
        const type = /\.(scss|sass)/.test(file.name) ? 'css' : 'js';
        const name = `${trimExt(file.name.replace(`.${postfix}`, ''))}.${type}`;
        const title = capitalize(file.name.replace(`.${file.extension}`, '').replace(`.${postfix}`, ''));
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