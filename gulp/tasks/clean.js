const del = require(`del`);

module.exports = (gulp, plugins, config) => {
    return done => {
        return del(config.paths.clean);
        done();
    }
};