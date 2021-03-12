const os = require(`os`);
const chalk = require(`chalk`);

const browser = os.platform() === `linux` ? `google-chrome` : (os.platform() === `darwin` ? `google chrome` : (os.platform() === `win32` ? `chrome` : `firefox`));

module.exports = (gulp, plugins, config) => {
    return done => {
        let { uri } = config.ftp[config.host];

        if (uri.slice(-1) === `/`) {
            uri = uri.substring(0, uri.length - 1);
        };

        const path = config.open !== `index` ? `${uri}/${config.open}.html` : uri;

        if (config.debug) {
            console.log(`${chalk.bold(`Открываю страницу ${chalk.italic(path)} в браузере...`)}`);
        };

        return gulp.src(__filename)
            .pipe(plugins.open({
                uri: path,
                app: browser
            }))
            .on(`end`, done);
    };
};