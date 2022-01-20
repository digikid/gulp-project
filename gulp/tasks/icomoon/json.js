const { readFile } = add('@gulp/utils/fs');

module.exports = (gulp, plugins, config) => {
    const {
        paths: {
            src: {
                icomoon: {
                    json: path
                }
            }
        }
    } = config;

    return done => {
        (async () => {
            const file = await readFile(path);

            let font = {
                family: '',
                name: '',
                prefix: ''
            };

            let icons = [];
            let map = '';

            if (file) {
                const json = JSON.parse(file.toString());

                if ('icons' in json) {
                    icons = (json.icons).map(({ properties }) => {
                        const { name } = properties;
                        const code = properties.code.toString(16);

                        return {
                            name,
                            code
                        };
                    });

                    map = `${icons.reduce((acc, { name, code }) => acc + `\n\t${name}: '\\${code}',`, '').slice(0, -1)}\n`;
                };

                if ('metadata' in json && 'preferences' in json) {
                    const {
                        metadata: {
                            name
                        },
                        preferences: {
                            fontPref: {
                                prefix,
                                metadata: {
                                    fontFamily: family
                                }
                            }
                        }
                    } = json;

                    font = {
                        name,
                        family,
                        prefix
                    };
                };
            };

            config.icomoon = {
                font,
                icons,
                map
            };

            done();
        })();
    };
};