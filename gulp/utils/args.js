const { argv } = require('yargs');
const { _: tasks } = argv;

const defaults = add('@gulp/config/args');

const { setDeep } = add('@gulp/utils/object');

const booleans = {
    true: ['1', 'true', 'y'],
    false: ['0', 'false', 'n']
};

const isBoolean = value => {
    if (typeof value === 'boolean') {
        return true;
    };

    if (typeof value === 'string') {
        return Object.values(booleans).flat().includes(value.toLowerCase());
    };

    return false;
};

const toBoolean = value => booleans.true.includes(value.toLowerCase());

const get = a => argv[a] !== undefined ? argv[a] : false;

const parse = (args = {}) => {
    const params = {};

    Object.keys(args).forEach(param => {
        const value = get(param);
        const defaultValue = defaults[param];
        const type = typeof defaults[param];

        if (!(param in defaults)) return;

        if (value) {
            if (type === 'object') {
                if (Array.isArray(defaultValue)) {
                    if (typeof value === 'string') {
                        if (value.includes(',')) {
                            params[param] = [];

                            value.split(',').forEach(value => {
                                params[param].push(value);
                            });
                        } else {
                            params[param] = value;
                        };
                    };

                    if (typeof value === 'boolean') {
                        params[param] = defaultValue;
                    };
                } else {
                    params[param] = Object.assign({}, defaultValue);

                    if (typeof value === 'string') {
                        if (value.includes(',')) {
                            value.split(',').forEach(key => {
                                params[param][key] = true
                            });
                        } else if (value in params[param]) {
                            params[param][value] = true;
                        };
                    };

                    if (typeof value === 'boolean') {
                        setDeep(params, param, true);
                    };
                };
            } else if (typeof value === 'string' && isBoolean(value)) {
                params[param] = toBoolean(value);
            } else {
                params[param] = value;
            };
        } else {
            params[param] = defaultValue;
        };
    });

    return params;
};

const task = tasks[tasks.length - 1] || 'build';

module.exports = {
    argv,
    isBoolean,
    toBoolean,
    get,
    parse,
    task
};