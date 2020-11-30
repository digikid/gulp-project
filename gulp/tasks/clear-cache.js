const chalk = require(`chalk`);

module.exports = (gulp, plugins, config) => {
    return done => {
        if (config.debug) {
            console.log(`${chalk.bold(`Очистка кеша...`)}`);
        };

        return plugins.cache.clearAll(done);
    };
};