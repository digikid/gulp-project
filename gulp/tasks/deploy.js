module.exports = (gulp, plugins, config) => {
    return done => {
        const tasks = [
            'build',
            'upload',
            'browser'
        ];

        return gulp.series(...tasks)(done);
    };
};