const chalk = require('chalk');

const { presets, preset } = add('@gulp/core/presets');

module.exports = () => {
    const messageEnd = `\nПереопределить параметры и пресеты можно с помощью командной строки или вручную в файле конфигурации ${chalk.italic.black.bgWhiteBright('/config')}.\nПараметры командной строки имеют более высокий приоритет, чем параметры из файла.\nЗначения по умолчанию для параметров командной строки находятся в файле ${chalk.italic.black.bgWhiteBright('/gulp/config/args.js')}.`;

    let messageBegin = '';

    if (preset in presets) {
        if ('global' in presets) {
            messageBegin = `${chalk.bold.green(`Пресеты ${chalk.bold('global')} и ${chalk.bold(preset)} активированы`)}`;
        } else {
            messageBegin = `${chalk.bold.green(`Пресет ${chalk.bold(preset)} активирован`)}`;
        };
    } else if ('global' in presets) {
        messageBegin = `${chalk.bold.green(`Пресет ${chalk.bold('global')} активирован`)}`;
    };

    console.log(`${messageBegin}${messageEnd}`);
};