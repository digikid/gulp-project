const { trimExt } = add('@gulp/utils/path');
const { scanDirectory } = add('@gulp/utils/fs');

const config = add('@gulp/core/config');

module.exports = () => {
    const {
        name,
        paths,
        aliases: {
            zip: aliases
        }
    } = config;

    const tree = scanDirectory(paths.output.root);

    const arr = tree.filter(({ type, extension }) => (type === 'file' && extension === 'zip')).map(({ name, size, relativePath }) => {
        const title = aliases[trimExt(name)];
        const path = `/${relativePath}`;
        const type = 'zip';

        return {
            name,
            path,
            type,
            title,
            size
        };
    });

    return arr;
};