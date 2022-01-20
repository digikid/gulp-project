const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const getHtmlTitle = (str, value = 'Без названия') => str.includes('<title>') ? str.split('<title>')[1].split('</title>')[0] : value;

const getHtmlImport = (type, path) => {
    if (type === 'css') {
        return `<link rel="stylesheet" href="${path}">`;
    };

    if (type === 'js') {
        return `<script src="${path}"></script>`;
    };
};

module.exports = {
    capitalize,
    getHtmlTitle,
    getHtmlImport
};