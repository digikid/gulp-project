const chalk = require('chalk');

const { argv, parse } = add('@gulp/utils/args');

const defaultArgs = add('@gulp/config/args');

const passedArgs = parse(argv);

module.exports = () => {
    Object.keys(passedArgs).forEach(param => {
        const value = JSON.stringify(passedArgs[param]);
        const defaultValue = JSON.stringify(defaultArgs[param]);

        if (value !== defaultValue) {
            console.log(`${chalk.bold.bgCyanBright(`Параметр [${chalk.bold(param)}] переопределён из командной строки`)}\nЗначение по умолчанию ${chalk.bold.magenta(`${defaultValue}`)} изменено на ${chalk.bold.magenta((value))}.`);
        };
    });
};