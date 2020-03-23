const defaults = require(`../defaults`);
const argv = require(`yargs`).argv;

const getParam = a => argv[a] !== undefined ? argv[a] : false;

let args = {};

Object.keys(defaults).forEach(param => {
    if (param === `host` && typeof getParam(param) !== `string`) {
        return;
    };

    if (param === `minify`) {
        if (!getParam(param)) {
            return;
        };

        if (args.minify === undefined) {
            args.minify = {...defaults.minify};
        };

        getParam(param).split(`,`).forEach(param => args.minify[param] = true);
    } else {
        args[param] = getParam(param);
    };
});

module.exports = {
    ...defaults,
    ...args
};
