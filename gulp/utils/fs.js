const dree = require('dree');
const del = require('del');

const { promises: fs } = require('fs');

const isExists = async path => {
    try {
        const check = await fs.stat(path);

        return !!check;
    } catch (e) {
        return false;
    };
};

const readFile = async path => {
    if (!(await isExists(path))) {
        return '';
    };

    try {
        const data = await fs.readFile(path, {
            encoding: 'utf-8'
        });

        return data;
    } catch(e) {
        throw e;
    };
};

const writeFile = async (path, data = '') => {
    try {
        await fs.writeFile(path, data, 'utf8');

        return data;
    } catch(e) {
        throw e;
    };
};

const removeDirectory = async path => {
    await del(path);
};

const createDirectory = async path => {
    try {
        if (await isExists(path)) {
            await removeDirectory(path);
        };

        await fs.mkdir(path);

        return path;
    } catch(e) {
        throw e;
    };
};

const scanDirectory = (path, options = {}) => {
    try {
        const result = dree.scan(path.replace('@', './'), {
            showHidden: false,
            ...options
        });

        const tree = (result && ('children' in result)) ? result.children : [];

        return tree;
    } catch(e) {
        return [];
    };
};

module.exports = {
    isExists,
    readFile,
    writeFile,
    removeDirectory,
    createDirectory,
    scanDirectory
};