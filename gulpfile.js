require('dotenv').config();

const gulp = require(`gulp`);
const plugins = require(`gulp-load-plugins`)();

const { mergeDeep } = require(`./gulp/helpers/utils`);
const tasks = require(`./gulp/helpers/tasks`);

const configUser = require(`./config`);
const configGulp = require(`./gulp/config`);

const config = mergeDeep({}, configGulp, configUser);

global.currentWatcher = null;

tasks.forEach(task => {
    gulp.task(task, require(`./gulp/tasks/` + task)(gulp, plugins, config));
});
