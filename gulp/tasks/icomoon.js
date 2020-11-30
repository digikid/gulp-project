const { promises: fs } = require(`fs`);
const chalk = require(`chalk`);

module.exports = (gulp, plugins, config) => {
    return async done => {
        try {
            const json = await fs.readFile(config.paths.src.icomoon.json, `utf8`, (e, data) => data);

            if (config.debug) {
                console.log(`${chalk.bold(`Добавление иконок...`)}`);
            };

            (async () => {
                const icomoon = JSON.parse(json);
                const sassConfig = config.paths.src.sass.config;

                const buildSass = cb => {
                    gulp.src(config.paths.src.icomoon.json)
                        .pipe(plugins.icomoonBuilder(config.plugins.icomoonBuilder))
                        .pipe(plugins.rename(config.paths.src.icomoon.fileName))
                        .pipe(gulp.dest(config.paths.src.icomoon.output))
                        .on(`end`, cb);
                };

                const copyFonts = cb => {
                    gulp.src(config.paths.src.icomoon.fonts, {
                            base: config.paths.src.icomoon.root
                        }).pipe(gulp.dest(config.paths.output.root))
                        .on(`end`, cb);
                };

                const fontFile = icomoon.metadata.name;
                const fontFamily = icomoon.preferences.fontPref.metadata.fontFamily;
                const fontPrefix = icomoon.preferences.fontPref.prefix;

                const fontFileRegex = /(\$icomoon-font-name: ')([a-z\d_-]*)(';)/gim;
                const fontFamilyRegex = /(\$icomoon-font-family: ')([a-z\d_-]*)(';)/gim;
                const fontPrefixRegex = /(\$icomoon-prefix: ')([a-z_-][a-z\d_-]*)(';)/gim;

                const sassConfigData = await fs.readFile(sassConfig, `utf8`, (err, data) => {!err ? data : ``});
                const sassConfigDataUpdated = sassConfigData.replace(fontFamilyRegex, `\$1${fontFamily}\$3`).replace(fontFileRegex, `\$1${fontFile}\$3`).replace(fontPrefixRegex, `\$1${fontPrefix}\$3`);

                await fs.writeFile(sassConfig, sassConfigDataUpdated, `utf8`, e => console.log(e));

                config.icomoon = icomoon.icons.map(item => item.properties.name);

                gulp.series(copyFonts, buildSass)(done);
            })();

        } catch(e) {
            done();
        };
    };
};
