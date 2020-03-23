module.exports = (gulp, plugins, config) => {
    return done => {
        return plugins.cache.clearAll(done);
    };
};