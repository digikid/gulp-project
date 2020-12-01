const chalk = require(`chalk`);

module.exports = (gulp, plugins, config) => done => {
    const {ftp, host} = config;

    if (!ftp[host].host) {
        done();
        return;
    };

    const tasks = config.force ? [`upload`, `browser`] : [`build`, `upload`, `browser`];

    gulp.series(...tasks)(done);
};