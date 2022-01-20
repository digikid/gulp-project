const { readFile, writeFile } = add('@gulp/utils/fs');

module.exports = (gulp, plugins, config) => {
    const {
        paths: {
            src: {
                icomoon: {
                    sass
                }
            }
        }
    } = config;

    const regex = {
        name: /(\$icomoon-font-name: ')(.*)(';)/gi,
        family: /(\$icomoon-font-family: ')(.*)(';)/gi,
        prefix: /(\$icomoon-prefix: ')(.*)(';)/gi,
        map: /(\$icomoon-icons: \()(.*)(\);)/gis
    };

    return done => {
        (async () => {
            const {
                icomoon: {
                    font,
                    map
                }
            } = config;

            const data = {
                ...font,
                map
            };

            const file = await readFile(sass);

            const updated = Object.keys(regex).reduce((acc, param) => acc.replace(regex[param], `\$1${data[param]}\$3`), file);

            await writeFile(sass, updated);

            done();
        })();
    };
};