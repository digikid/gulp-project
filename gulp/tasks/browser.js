const os = require(`os`);
const ftp = require(`../ftp`);

const browser = os.platform() === `linux` ? `google-chrome` : (os.platform() === `darwin` ? `google chrome` : (os.platform() === `win32` ? `chrome` : `firefox`));

module.exports = (gulp, plugins, config) => {
    return done => {
        return gulp.src(__filename)
            .pipe(plugins.open({
                uri: ftp[config.host].uri,
                app: browser
            }));
    };
};