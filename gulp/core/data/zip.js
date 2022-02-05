const { scanDirectory } = add('@gulp/utils/fs');

const config = add('@gulp/core/config');

module.exports = () => {
    const {
        name,
        paths,
        zip
    } = config;

    const tree = scanDirectory(paths.output.root);

    const arr = tree.filter(({ type, extension }) => (type === 'file' && extension === 'zip')).map(({ name, size }) => {
        const item = Object.values(zip).find(item => item.name === name);

        const title = (item && ('title' in item)) ? item.title : 'Неизвестный архив';
        const path = `../${name}`;
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