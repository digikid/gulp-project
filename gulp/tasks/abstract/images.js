module.exports = (gulp, plugins, config) => {
    const {
        paths: {
            src: {
                abstract: {
                    images: src
                }
            },
            output: {
                abstract: {
                   images: dest
                }
            }
        }
    } = config;

    return done => {
        return gulp.src(src)
            .pipe(gulp.dest(dest))
            .on('end', done);
    };
};