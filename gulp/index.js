const queue = [
    'check',
    'debug',
    'tasks'
];

const tasks = queue.forEach(task => add(`@gulp/core/${task}`)());

module.exports = tasks;