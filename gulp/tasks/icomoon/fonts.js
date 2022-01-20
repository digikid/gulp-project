module.exports = (gulp, plugins, config) => {
    const {
        paths: {
            src: {
                icomoon: {
                    root: base,
                    fonts: src
                }
            },
            output: {
                root: dest
            }
        }
    } = config;

    return done => {
        return gulp.src(src, {
                base
            }).pipe(gulp.dest(dest))
            .on('end', done);
    };
};