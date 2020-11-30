const chalk = require(`chalk`);

module.exports = (gulp, plugins, config) => {
    return done => {

        if (config.debug) {
            console.log(`${chalk.bold(`Копирование модулей и библиотек...`)}`);
        };

        const vendors = {
            js: [],
            css: []
        };

        const addToVendors = path => {
            if (path.endsWith(`.js`)) {
                ext = `js`;
            };

            if (path.endsWith(`.css`)) {
                ext = `css`;
            };

            vendors[ext].push(path);
        };

        for (let [vendor, path] of Object.entries(config.paths.vendor)) {
            if (path.length > 1) {
                path.forEach(path => addToVendors(path));
            } else {
                addToVendors(path.join());
            };
        };

        const moveFiles = (path, dest, cb) => {
            if (path.length) {
                return gulp.src(path)
                    .pipe(plugins.plumber())
                    .pipe(gulp.dest(dest))
                    .on(`end`, cb);
            } else {
                cb();
                return;
            };
        };

        const moveVendorJs = cb => moveFiles(vendors.js, config.paths.output.vendor.js, cb);
        const moveVendorCss = cb => moveFiles(vendors.css, config.paths.output.vendor.css, cb);
        const moveCustomVendor = cb => moveFiles(`${config.paths.src.vendor}/**`, config.paths.output.vendor.root, cb);

        gulp.parallel(moveVendorJs, moveVendorCss, moveCustomVendor)(done);
    };
};