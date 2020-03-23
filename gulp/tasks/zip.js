module.exports = (gulp, plugins, config) => {
    return done => {

        if (!config.zip) {
            done();
            return;
        };

        const createZip = (path, name, cb) =>
            gulp.src([`${path}/**/*.*`, `!${path}/*.zip`])
                .pipe(plugins.zip(name))
                .pipe(gulp.dest(config.paths.output.root))
                .on(`end`, cb);

        const createZipSource = cb => createZip(config.paths.src.root, config.files.zip.src, cb);
        const createZipOutput = cb => createZip(config.paths.output.root, config.files.zip.output, cb);

        gulp.parallel(createZipSource, createZipOutput)(done);
    };
};