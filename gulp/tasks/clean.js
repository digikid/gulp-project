const del = require(`del`);
const chalk = require(`chalk`);

module.exports = (gulp, plugins, config) => {
    return done => {
        if (config.debug) {
            console.log(`${chalk.bold(`Очистка временных директорий...`)}`);
        };

        return del(config.paths.clean);
        done();
    }
};