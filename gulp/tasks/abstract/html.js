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
        plugins: params,
        context: configContext,
        abstract,
        title,
        name,
        description,
        now,
        repo,
        version,
        boilerplateVersion,
        authors,
        copyright
    } = config;

    return done => {
        (async () => {
            const data = await fetchData();

            const context = {
                ...params.fileInclude.context,
                ...configContext,
                ...data,
                ...abstract,
                title,
                name,
                description,
                now,
                repo,
                version,
                boilerplateVersion,
                authors,
                copyright
            };

            return gulp.src(src)
                .pipe(plumber())
                .pipe(fileInclude({
                    ...params.fileInclude,
                    basepath: partials,
                    context
                }))
                .pipe(beautify.html(params.beautify.html))
                .pipe(gulp.dest(dest))
                .on('end', done);
        })();
    };
};