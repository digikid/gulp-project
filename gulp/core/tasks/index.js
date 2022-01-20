const gulp = require('gulp');

const { concat } = add('@gulp/utils/tasks');

const queue = [
    'build',
    'watch',
    'deploy',
    'dev',
    'default'
];

const cb = (task, func, params) => gulp.task(task, func(...params));

module.exports = () => concat('@gulp/tasks', queue, cb);
