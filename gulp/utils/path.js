const removeLastSlash = str => (str.slice(-1) === '/') ? str.substring(0, str.length - 1) : str;

const trimExt = str => str.replace(/\.[^/.]+$/, '');

const trimBefore = (str, value = '.') => {
    if (!str.includes(value)) return '';

    return str.split(value)[0];
};

const trimAfter = (str, value = '/') => {
    if (!str.includes(value)) return '';

    const parts = str.split(value);

    return parts[parts.length - 1];
};

const addPostfix = (str, value, postfix = '.min') => {
    const extension = str.substr(str.lastIndexOf('.'));

    return value ? str.replace(extension, `${postfix}${extension}`) : str;
};

module.exports = {
    removeLastSlash,
    trimExt,
    trimBefore,
    trimAfter,
    addPostfix
};