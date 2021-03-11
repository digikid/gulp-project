const pjson = require(`../../package.json`);

const argv = require(`yargs`).argv;
const chalk = require(`chalk`);

const defaults = require(`../defaults`);
const currentTask = require(`./currentTask`);
const config = require(`../../config`);
const { mergeDeep, capitalize } = require(`./utils`);
const getArgv = require(`./getArgv`);

const {
    FTP_HOST,
    FTP_USER,
    FTP_PASSWORD,
    FTP_DEST,
    FTP_URI
} = process.env;

const presets = `presets` in config ? mergeDeep({}, defaults.presets, config.presets) : defaults.presets;
const preset = getArgv(`preset`) || currentTask;

const { debug } = preset in presets ? presets[preset] : (config.presets.global || defaults.args);

const setAllParams = (param, value) => Object.keys(args[param]).forEach(item => args[param][item] = value);

let types = {};
let args = {};

let params;

if (debug) {
    console.log(`${chalk.bold(`Инициализация параметров...`)}`);

    if (pjson.name === `gulp-project`) {
        console.log(`${chalk.bold.bgYellowBright(`Укажите имя проекта`)}\nВ файле ${chalk.italic.bgWhiteBright(`/package.json`)} установлено имя текущей сборки, замените его на собственное.`);
    };

    if (pjson.repository.url === `https://github.com/digikid/gulp-project.git`) {
        console.log(`${chalk.bold.bgYellowBright(`Укажите ссылку на репозиторий`)}\nВ файле ${chalk.italic.bgWhiteBright(`/package.json`)} указана ссылка на репозиторий сборки, замените её на актуальную.`);
    };

    if (pjson.author.includes(`digikid`)) {
        console.log(`${chalk.bold.bgYellowBright(`Укажите авторство`)}\nВ файле ${chalk.italic.bgWhiteBright(`/package.json`)} укажите своё имя и контактные данные, либо оставьте поле пустым.`);
    };

    if (!config.title) {
        console.log(`${chalk.bold.bgYellowBright(`Укажите название проекта`)}\nНазвание проекта не указано, поэтому сейчас используется стандартное.\nЗадайте название проекта в файле ${chalk.italic.bgWhiteBright(`/config.json`)}.`);
    };
};

if (`global` in presets) {
    if (preset in presets) {
        params = mergeDeep({}, defaults.args, presets.global, presets[preset]);
    } else {
        params = mergeDeep({}, defaults.args, presets.global);
    };
} else {
    if (preset in presets) {
        params = mergeDeep({}, defaults.args, presets[preset]);
    } else {
        params = defaults.args;
    };
};

if (debug) {
    const presetMessageOutro = `\nПереопределить пресеты и другие параметры можно с помощью командной строки и в файле конфигурации ${chalk.italic.bgWhiteBright(`/config.js`)}.\nПараметры командной строки имеют более высокий приоритет, чем параметры конфигурации.\nПараметры по умолчанию заданы в файле ${chalk.italic.bgWhiteBright(`/gulp/defaults.js`)}.`;

    if (preset in presets) {
        const presetSource = preset in config.presets ? `/config.js` : `/gulp/defaults.js`;

        if (`global` in presets) {
            console.log(`${chalk.bold.bgGreenBright(`Пресеты ${chalk.bold(`global`)} и ${chalk.bold(preset)} активированы`)}${presetMessageOutro}`);
        } else {
            console.log(`${chalk.bold.bgGreenBright(`Пресет ${chalk.bold(preset)} активирован`)}${presetMessageOutro}`);
        };
    } else if (`global` in presets) {
        console.log(`${chalk.bold.bgGreenBright(`Пресет ${chalk.bold(`global`)} активирован`)}${presetMessageOutro}`);
    };
};

Object.keys(defaults.args).forEach(param => {
    const value = getArgv(param);

    types[param] = Array.isArray(defaults.args[param]) ? `array` : typeof defaults.args[param];

    if (value) {
        if (typeof defaults.args[param] === `object`) {
            args[param] = {...defaults.args[param]};

            if (typeof value === `string`) {
                if (value.includes(`,`)) {
                    value.split(`,`).forEach(item => args[param][item] = true);
                } else {
                    if (value in args[param]) {
                        args[param][value] = true;
                    };
                };
            };

            if (typeof value === `boolean`) {
                setAllParams(param, true);
            };
        } else {
            args[param] = value;
        };
    } else {
        args[param] = params[param];
    };
});

Object.keys(config).forEach(param => {
    if (param in types) {
        const type = types[param];
        const paramType = Array.isArray(config[param]) ? `array` : typeof config[param];

        if (type !== paramType) {
            console.log(`${chalk.bold.whiteBright.bgRedBright(`Неверный параметр`)}\nПараметр [${chalk.bold.blue(param)}], заданный в файле ${chalk.italic.bgWhiteBright(`/config.js`)}, имеет неверный тип (${chalk.bold(capitalize(paramType))} вместо ${chalk.bold(capitalize(type))}).`);
            process.exit();
        };

        if (debug) {
            const globalPresetMessage = `global` in config.presets ? `добавьте его в глобальный пресет [${chalk.bold.blue(`config.presets.global`)}].` : `создайте глобальный пресет [${chalk.bold.blue(`config.presets.global`)}] и передайте в него нужный параметр.`;

            console.log(`${chalk.bold.bgYellowBright(`Параметр проигнорирован`)}\nПараметр [${chalk.bold.blue(param)}] задан глобально в файле конфигурации ${chalk.italic.bgWhiteBright(`/config.js`)}, поэтому не может быть переопределен из командной строки.\nЧтобы установить параметр глобально, ${globalPresetMessage}`);
        };
    };
});

if (debug && args.babel) {
    console.log(`${chalk.bold.bgYellowBright(`Конвертация в ES5 включена`)}\nВ этом режиме все модули, подключенные через параметры конфигурации, игнорируются.\nПеред началом работы импортируйте необходимые модули в файле ${chalk.italic.bgWhiteBright(`/src/javascripts/import/modules.js`)}.`);

    setAllParams(`merge`, true);
};

if (args.compress) {
    setAllParams(`minify`, false);
};

if (currentTask === `deploy`) {
    if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD || !FTP_DEST || !FTP_URI) {
        console.log(`${chalk.bold.whiteBright.bgRedBright(`Параметры не заданы`)}\nНевозможно запустить задачу, т.к. в файле ${chalk.italic.bgWhiteBright(`/.env`)} не указаны параметры FTP.`);
        process.exit();
    };
};

args.presets = {presets};

module.exports = args;
