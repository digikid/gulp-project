const { task, get } = add('@gulp/utils/args');
const { mergeDeep } = add('@gulp/utils/object');

const defaultConfig = add('@gulp/config');
const userConfig = add('@/config');

const preset = get('preset') || task;

const presets = ('presets' in userConfig) ? mergeDeep({}, defaultConfig.presets, userConfig.presets) : defaultConfig.presets;

let params = {};

if ('global' in presets) {
    if (preset in presets) {
        params = mergeDeep({}, presets.global, presets[preset]);
    } else {
        params = mergeDeep({}, presets.global);
    };
} else if (preset in presets) {
    params = mergeDeep({}, presets[preset]);
};

const config = Object.entries(params).reduce((acc, [param, value]) => {
    if (!('args' in acc)) acc.args = {};

    if (param in defaultConfig.args) {
        acc.args[param] = value;
    } else {
        acc[param] = value;
    };

    return acc;
}, {});

module.exports = {
    preset,
    presets,
    params,
    config
};