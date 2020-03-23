const dree = require(`dree`);

const priority = [
    `build`,
    `watch`,
    `deploy`,
    `dev`,
    `default`
];

const tasks = dree.scan(`./gulp/tasks`).children.filter(task => task.extension === `js`).map(task => task.name.replace(`.js`, ``)).filter(task => !priority.includes(task)).concat(priority);

module.exports = tasks;
