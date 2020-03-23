const vinyl = require(`vinyl-ftp`);
const log = require(`fancy-log`);

const ftp = require(`../ftp`);

module.exports = (gulp, plugins, config) => {
    return done => {
        return gulp.src(config.paths.deploy.source, {
            base: config.paths.deploy.base,
            buffer: false
        })
        .pipe(vinyl
            .create({
                host: ftp[config.host].host,
                user: ftp[config.host].user,
                password: ftp[config.host].password,
                parallel: 1,
                log: log
            })
            .dest(ftp[config.host].dest)
        );
    };
};