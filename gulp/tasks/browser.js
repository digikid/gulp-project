const os = require('os');
const ftp = require('../../ftp');

const browser = os.platform() === 'linux' ? 'google-chrome' : (os.platform() === 'darwin' ? 'google chrome' : (os.platform() === 'win32' ? 'chrome' : 'firefox'));

module.exports = (gulp, plugins, config) => {
    const path = config.open;

    let uri = ftp[config.host].uri;

    if (uri.slice(-1) === `/`) {
        uri = uri.substring(0, uri.length - 1);
    };

    return (done) => {
        return gulp.src(__filename)
            .pipe(plugins.open({
                uri: `${uri}/${path}.html`,
                app: browser
            }));
    };
};