const chalk = require('chalk');

const { task } = add('@gulp/utils/args');

const config = add('@gulp/core/config');

const {
    FTP_HOST,
    FTP_USER,
    FTP_PASSWORD,
    FTP_DEST,
    FTP_URI
} = process.env;

const { args, ftp } = config;

const host = args.host.toString();

let check = true;

module.exports = () => {
    if (host && !(host in ftp)) {
        console.log(`${chalk.bold.whiteBright.bgRedBright('Неверный параметр')}\nНевозможно запустить задачу, т.к. вы выбран несуществующий FTP хост [${chalk.bold.blue(host)}].\nДля начала работы добавьте его в файл ${chalk.italic.black.bgWhiteBright('/.env')}.`);

        check = false;
    };

    if (task === 'deploy' && (!FTP_HOST || !FTP_USER || !FTP_PASSWORD || !FTP_DEST || !FTP_URI)) {
        console.log(`${chalk.bold.whiteBright.bgRedBright('Параметры не заданы')}\nНевозможно запустить задачу, т.к. в файле ${chalk.italic.black.bgWhiteBright('/.env')} не указаны параметры FTP.`);

        check = false;
    };

    return check;
};