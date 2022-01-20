module.exports = (gulp, plugins, config) => {
    const {
        paths: {
            src: {
                abstract: {
                    sass: src
                }
            },
            output: {
                abstract: {
                    css: dest
                }
            }
        },
        files: {
            abstract: {
                css: fileName
            }
        },
        plugins: params
    } = config;

    const {
        plumber,
        sass,
        autoprefixer,
        concat,
        groupCssMediaQueries,
        cssbeautify
    } = plugins;

    return done => {
        return gulp.src(src)
            .pipe(plumber())
            .pipe(sass.sync(params.sass).on('error', sass.logError))
            .pipe(autoprefixer())
            .pipe(concat(`${fileName}.css`))
            .pipe(groupCssMediaQueries())
            .pipe(cssbeautify())
            .pipe(gulp.dest(dest))
            .on('end', done);
    };
};