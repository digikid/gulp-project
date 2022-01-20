const defineName = (value, func) => Object.defineProperty(func, 'name', {
    value
});

module.exports = {
    defineName
};