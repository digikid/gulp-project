const now = require(`../helpers/now`);

module.exports = (gulp, plugins, config) => {
    return done => {
        return gulp.src(config.paths.src.html.root)
            .pipe(plugins.plumber())
            .pipe(plugins.fileInclude({
                prefix: `@@`,
                basepath: config.paths.src.html.partials,
                context: {
                    title: config.title,
                    year: now.year
                }
            }))
            .pipe(plugins.inject(gulp.src([
                    `${config.paths.output.js}/${config.files.polyfills}`,
                    `${config.paths.output.vendor.root}/${config.files.bootstrap}`,
                    `${config.paths.output.vendor.root}/**/jquery.min*.js`,
                    `${config.paths.output.vendor.root}/**/*.{css,js}`,
                    `${config.paths.output.css}/${config.files.css.split(`.`)[0]}*.css`,
                    `${config.paths.output.css}/**/*.css`,
                    `${config.paths.output.js}/${config.files.js.split(`.`)[0]}*.js`,
                    `${config.paths.output.js}/**/*.js`
                ], {allowEmpty: true}), {
                ignorePath: `dist/`,
                addRootSlash: false,
                removeTags: true,
                empty: true
            }))
            .pipe(plugins.if(config.minify.html, plugins.htmlmin({
                collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: true,
                processConditionalComments: true,
                removeComments: true
            }), plugins.beautify.html({
                max_preserve_newlines: 5,
                end_with_newline: true,
                indent_inner_html: true,
                space_before_conditional: true
            })))
            .pipe(gulp.dest(config.paths.output.root));
    };
};