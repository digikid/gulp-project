const server = require(`browser-sync`);
const chalk = require(`chalk`);

module.exports = (gulp, plugins, config) => {
    return done => {
        if (config.debug) {
            console.log(`${chalk.bold(`Запуск BrowserSync...`)}`);
        };

        server.init(config.plugins.webserver);
        done();
    };
};