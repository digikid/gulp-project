const { name } = add('@/package.json');

module.exports = {
    theme: 'default',
    order: {
        first: ['index.html'],
        last: ['404.html', 'ui.html'],
    },
    zip: false
};