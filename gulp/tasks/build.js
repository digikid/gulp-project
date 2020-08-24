module.exports = (gulp, plugins) => gulp.series(
    `clean`,
    `icomoon`,
    `bootstrap`,
    `sass`,
    `js`,
    `vendor`,
    `compress`,
    `images`,
    `steady`,
    `html`,
    `zip`,
    `common`
);