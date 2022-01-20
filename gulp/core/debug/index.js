const { concat } = add('@gulp/utils/tasks');

const { args: { debug } } = add('@gulp/core/config');

const queue = [
    'overriden',
    'presets',
    'babel'
];

const cb = (task, func) => {
    if (!debug) return;

    func();
};

const tasks = () => concat('@gulp/core/debug', queue, cb);

module.exports = tasks;