const fetchData = add('@gulp/core/data');

module.exports = (gulp, plugins, config) => {
    const {
        plumber,
        fileInclude,
        beautify
    } = plugins;

    const {
        paths: {
            src: {
                abstract: {
                    html: src,
                    partials
                }
            },
            output: {
                abstract: {
                    root: dest
                }
            }
        },
        title,
        name,
        description,
        now,
        repo,
        version,
        theme,
        authors,
        copyright,
        plugins: params
    } = config;

    return done => {
        (async () => {
            const data = await fetchData();

            const fileIncludeParams = {
                ...params.fileInclude,
                basepath: partials,
                context: {
                    ...params.fileInclude.context,
                    ...data,
                    title,
                    name,
                    description,
                    now,
                    repo,
                    version,
                    theme,
                    authors,
                    copyright
                }
            };

            return gulp.src(src)
                .pipe(plumber())
                .pipe(fileInclude(fileIncludeParams))
                .pipe(beautify.html(params.beautify.html))
                .pipe(gulp.dest(dest))
                .on('end', done);
        })();
    };
};