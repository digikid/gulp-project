module.exports = (gulp, plugins, config) => {
    return done => {
        gulp.watch(config.paths.watch.html, gulp.series(`html`, `common`, `reload`));
        gulp.watch(config.paths.watch.sass.root, gulp.series(`sass`, `html`, `common`, `reload`));
        gulp.watch(config.paths.watch.sass.bootstrap, gulp.series(`bootstrap`, `reload`));
        gulp.watch(config.paths.watch.js, gulp.series(`js`, `html`, `common`, `reload`));
        gulp.watch(config.paths.watch.img, gulp.series(`images`, `reload`));
        gulp.watch(config.paths.watch.vectors, gulp.series(`sass`, `reload`));
        gulp.watch(config.paths.watch.vendor, gulp.series(`vendor`, `html`, `common`, `reload`));
        gulp.watch(config.paths.watch.steady, gulp.series(`steady`, `reload`));
        gulp.watch(config.paths.watch.icomoon, gulp.series(`icomoon`, `reload`));
        gulp.watch(config.paths.watch.common, gulp.series(`common`, `reload`));
    };
};