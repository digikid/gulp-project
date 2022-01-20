const chalk = require('chalk');

const config = add('@gulp/core/config');

module.exports = () => {
    if (!config.babel && !config.modules.babel) {
        return;
    };

    console.log(`${chalk.bold.green('Транспиляция в ES5 включена')}\nОперации с JS файлами могут занять продолжительное время, используйте этот параметр только в production mode.`);
};