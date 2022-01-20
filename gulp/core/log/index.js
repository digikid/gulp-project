const { args: { debug } } = add('@gulp/core/config');

module.exports = (text, type = 'log') => {
    if ((!debug && type !== 'error') || !text) return;

    console[type](text);
};