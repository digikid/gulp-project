const chalk = require('chalk');

const { args: defaultArgs } = add('@gulp/config');
const { args: configArgs } = add('@gulp/core/config');

const { getType } = add('@gulp/utils/type');
const { capitalize } = add('@gulp/utils/string');

let check = true;

module.exports = () => {
    Object.keys(defaultArgs).forEach(param => {
        const defaultType = getType(defaultArgs[param]);
        const paramType = getType(configArgs[param]);

        if (defaultType !== paramType) {
            console.log(`${chalk.bold.whiteBright.bgRedBright('Неверный параметр')}\nПараметр [${chalk.bold.blue(param)}], заданный в файле ${chalk.italic.black.bgWhiteBright('/config.js')}, имеет неверный тип (${chalk.bold(capitalize(paramType))} вместо ${chalk.bold(capitalize(defaultType))}).`);

            check = false;
        };
    });

    return check;
};