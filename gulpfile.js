const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const tasks = require('./gulp/helpers/tasks');
const config = require('./gulp/config');

tasks.forEach(task => {
    gulp.task(task, require('./gulp/tasks/' + task)(gulp, plugins, config));
});
