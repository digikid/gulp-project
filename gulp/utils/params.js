const { scanDirectory } = add('@gulp/utils/fs');

const concat = (directory, options) => {
    const path = directory.replace('@', './');

    const tree = scanDirectory(path, {
        depth: 5,
        exclude: [/index\.js/, /\.DS_Store/]
    });

    return tree.filter(({ name }) => (name !== 'index.js')).reduce((acc, { name, extension, type }) => {
        const key = name.replace(`.${extension}`, '');
        const path = `${directory}/${name}`;

        const params = ((type === 'directory') ? concat : add)(path, options);

        const value = (typeof params === 'function') ? params(options) : params;

        acc[key] = value;

        return acc;
    }, {});
};

module.exports = {
    concat
};