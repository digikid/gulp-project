const { argv, parse } = add('@gulp/utils/args');
const { cloneDeep, mergeDeep } = add('@gulp/utils/object');

const defaultConfig = add('@gulp/config');
const userConfig = add('@/config');

const { config: presetsConfig } = add('@gulp/core/presets');

const config = mergeDeep({}, defaultConfig, userConfig, presetsConfig, {
    args: parse(argv)
});

module.exports = config;