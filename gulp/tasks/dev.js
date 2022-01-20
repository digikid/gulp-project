module.exports = (gulp, plugins, config) => {
    return done => {
        const { args: { force } } = config;

        let tasks = [
            'build',
            'webserver',
            'watch'
        ];

        if (force.length) {
            tasks = tasks.filter(task => (task === 'build') || force.includes(task));
        };

        return gulp.series(...tasks)(done);
    };
};