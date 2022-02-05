const { addPostfix } = add('@gulp/utils/path');

const config = add('@gulp/core/config');

module.exports = () => {
    const {
        paths,
        args: {
            minify
        },
        files: {
            main: files
        },
        aliases: {
            main: aliases
        }
    } = config;

    const arr = Object.entries(files).map(([type, fileName]) => {
        const name = addPostfix(`${fileName}.${type}`, minify[type], '.min');
        const path = `${paths.output[type]}/${name}`.replace(paths.output.root, '..');
        const title = aliases[type];

        return {
            name,
            path,
            type,
            title
        };
    });

    return arr;
};