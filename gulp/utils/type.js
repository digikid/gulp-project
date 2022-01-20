const getType = value => Array.isArray(value) ? 'array' : typeof value;

module.exports = {
    getType
};