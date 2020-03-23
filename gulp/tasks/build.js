module.exports = (gulp, plugins) => gulp.series(
    `clean`,
    `icomoon`,
    `bootstrap`,
    `sass`,
    `js`,
    `vendor`,
    `images`,
    `steady`,
    `html`,
    `zip`,
    `common`
);