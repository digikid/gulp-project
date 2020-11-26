module.exports = (gulp, plugins) => gulp.series(
    `clean`,
    `icomoon`,
    `bootstrap`,
    `sass`,
    `vendor`,
    `js`,
    `compress`,
    `images`,
    `steady`,
    `html`,
    `zip`,
    `common`
);