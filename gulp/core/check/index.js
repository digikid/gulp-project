let check = true;

const { concat } = add('@gulp/utils/tasks');

const queue = [];

const cb = (task, func) => {
    check = check && func();

    if (!check) {
        process.exit();
    };
};

const tasks = () => concat('@gulp/core/check', queue, cb);

module.exports = tasks;