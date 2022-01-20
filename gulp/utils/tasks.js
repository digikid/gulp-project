const gulp = require('gulp');

const plugins = require('gulp-load-plugins')({
    postRequireTransforms: {
        sass: function(sass) {
            return sass(require('sass'));
        }
    }
});

const config = add('@gulp/core/config');

const { defineName } = add('@gulp/utils/function');
const { scanDirectory } = add('@gulp/utils/fs');

const params = [gulp, plugins, config];

const concat = async (directory, queue = [], cb) => {
    const path = directory.replace('@', './');

    const tree = scanDirectory(path, {
        depth: 1,
        exclude: [/index\.js/],
        extensions: ['js']
    }).filter(({ type }) => type === 'file');

    const tasks = tree.map(({ name }) => name.replace('.js', '')).filter(task => !queue.includes(task)).concat(queue);

    tasks.forEach(task => {
        if (typeof cb === 'function') {
            cb(task, add(`${directory}/${task}`), params);
        } else {
            add(`${directory}/${task}`)(params);
        };
    });
};

const concatGulp = (directory, queue = [], cb) => {
    const tasks = params => queue.map(task => defineName(`${directory}:${task}`, add(`@gulp/tasks/${directory}/${task}`)(...params)));

    return gulp.series(...tasks(params))(cb);
};

module.exports = {
    concat,
    concatGulp
};