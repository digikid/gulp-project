const server = require(`browser-sync`);

module.exports = (gulp, plugins, config) => {
    return done => {
        server.reload();
        done();
    };
};