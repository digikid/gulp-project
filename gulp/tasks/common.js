const { promises: fs } = require(`fs`);

const dree = require(`dree`);
const del = require(`del`);

const now = require('../helpers/now');

const readFile = async (path, encoding = `utf-8`) => fs.readFile(path, { encoding });

const createFile = (path, data = ``) => fs.writeFile(path, data, `utf8`);

const createDirectory = path => fs.mkdir(path).catch(err => {
    if (err.code !== `EEXIST`) throw err;
}).then(() => {});

module.exports = (gulp, plugins, config) => {
    return done => {
        readFile(`${config.paths.src.root}/index.html`).then(() => done()).catch(e => {
            readFile(`${config.paths.src.common.root}/index.html`).then(async () => {
                createDirectory(`${config.paths.src.common.root}/data`);

                const modules = await fs.access(config.paths.src.import).then(() => config.common.import).catch(e => false);
                const modulesFile = /[^/]*$/.exec(config.paths.src.import)[0];

                const globalFiles = [
                    config.minify.css || config.compress ? config.files.css.replace(`.css`, `.min.css`) : config.files.css,
                    config.minify.js || config.compress ? config.files.js.replace(`.js`, `.min.js`) : config.files.js
                ];

                let files = {
                    html: [],
                    globals: [],
                    components: [],
                    vendor: []
                };

                const tree = dree.scan(config.paths.output.root, {
                    depth: 3,
                    stat: false,
                    size: true,
                    normalize: true,
                    followLinks: true,
                    exclude: [/fonts/, /images/],
                    extensions: [`css`, `js`, `html`, `zip`]
                }).children;

                const html = tree.filter(item => item.type === `file` & item.extension === `html` && item.name !== `index.html`).map(item => {
                    return {
                        name: item.name,
                        path: item.relativePath,
                        type: item.extension
                    };
                });

                files.html = html.filter(item => config.common.first.includes(item.name)).concat(html.filter(item => !config.common.first.includes(item.name) && !config.common.last.includes(item.name))).concat(html.filter(item => config.common.last.includes(item.name))).map((item, id) => {
                    return {
                        id, ...item
                    };
                });

                const titles = files.html.map(async item => {
                    await fs.readFile(`${config.paths.output.root}/${item.name}`, `utf-8`).then(data => {
                        item.title = config.common.aliases.map(alias => alias.name).includes(item.name) ? config.common.aliases.filter(alias => alias.name === item.name)[0].title : data.includes(`<title>`) ? data.split(`<title>`)[1].split(`</title>`)[0] : config.common.files.html;
                    });
                });

                Promise.all(titles).then(() => {
                    tree.filter(item => item.type === `directory` && (item.name === `css` || item.name === `js`)).reduce((acc, val) => acc.concat(val.children), []).filter(item => item.name !== config.files.polyfills).forEach(item => {

                        const type = globalFiles.includes(item.name) ? `globals` : `components`,
                            title = item.name.charAt(0).toUpperCase() + item.name.replace(`.${item.extension}`, ``).slice(1).replace(`.min`, ``);

                        if (!files[type].filter(file => file.title === title).length) {
                            let result = {
                                title: type === `globals` ? config.common.files[item.extension] : title,
                                name: item.name
                            };

                            if (type === `globals`) {
                                result.title = config.common.files[item.extension];
                                result.path = item.relativePath;
                                result.type = item.extension;
                            } else {
                                result = {
                                    ...result,
                                    [item.extension]: {
                                        name: item.name,
                                        path: item.relativePath
                                    }
                                }
                            };

                            files[type].push(result);
                        } else {
                            files[type].filter(file => file.title === title)[0][item.extension] = {
                                name: item.name,
                                path: item.relativePath
                            };
                        };
                    });

                    files.components.sort((a, b) => a.title > b.title ? 1 : -1).map((item, id) => {
                        item.id = id;
                        [`js`, `css`].forEach(extension => {
                            if (!item[extension]) {
                                item[extension] = {};
                                item[extension].name = item[extension].path = ``;
                            };
                        });
                    });

                    tree.filter(item => item.type === `directory` && item.name === `vendor`).reduce((acc, val) => acc.concat(val.children), []).reduce((acc, val) => acc.concat(val.children), []).reverse().forEach(item => {

                        const title = item.name.replace(/\.+(umd|min|concat)/g, ``).replace(/\.+(css|js)/g, ``),
                            extension = item.name;

                        if (!files.vendor.filter(file => file.title.replace(/\.+(css|js)/g, ``) === title).length) {
                            files.vendor.push({
                                title: `${title}.${item.extension}`,
                                type: item.extension
                            });
                        };
                    });

                    files.vendor.sort((a, b) => a.title > b.title ? 1 : -1).map((item, id) => item.id = id);

                    if (config.zip) {
                        files.zip = tree.filter(item => item.type === `file` && item.extension === `zip`).map((item, id) => {
                            const title = item.name === config.files.zip.src ? config.common.files.src : item.name === config.files.zip.output ? config.common.files.output : item.name;
                            return {
                                id: id,
                                title,
                                name: item.name,
                                size: item.size,
                                type: item.extension
                            };
                        });
                    };

                    files.authors = config.common.authors;

                    if (config.compress) {
                        del(config.paths.output.vendor.root);
                    };

                    const jsonFiles = Object.keys(files).map(file => {
                        return createFile(`${config.paths.src.common.data}/${file}.json`, JSON.stringify(files[file]));
                    });

                    Promise.all(jsonFiles).then(() => {

                        const commonSass = cb => gulp.src(`${config.paths.src.common.sass}/**/*.scss`)
                            .pipe(plugins.plumber())
                            .pipe(plugins.sass())
                            .pipe(plugins.autoprefixer())
                            .pipe(plugins.concat(`style.css`))
                            .pipe(plugins.groupCssMediaQueries())
                            .pipe(plugins.cssbeautify())
                            .pipe(gulp.dest(`${config.paths.output.root}/common`))
                            .on(`end`, cb);

                        const commonHtml = cb => gulp.src(`${config.paths.src.common.root}/*.html`)
                            .pipe(plugins.plumber())
                            .pipe(plugins.fileInclude({
                                prefix: `@@`,
                                basepath: config.paths.src.common.partials,
                                context: {
                                    title: config.title,
                                    name: config.name,
                                    theme: config.common.theme,
                                    now: now,
                                    year: now.year,
                                    merge: config.merge,
                                    zip: config.zip,
                                    pages: files.html.length,
                                    globals: files.globals.length,
                                    components: files.components.length,
                                    vendor: files.vendor.length,
                                    authors: files.authors.length,
                                    copyright: config.common.copyright,
                                    repo: config.repo,
                                    version: config.version,
                                    modules,
                                    modulesFile
                                }
                            }))
                            .pipe(plugins.beautify.html({
                                indent_size: 4,
                                max_preserve_newlines: 1
                            }))
                            .pipe(gulp.dest(config.paths.output.root))
                            .on(`end`, cb);

                        const commonImages = cb => gulp.src(`${config.paths.src.common.root}/images/**/*.*`)
                            .pipe(gulp.dest(`${config.paths.output.root}/common/images`))
                            .on(`end`, cb);

                        gulp.parallel(commonSass, commonHtml, commonImages)(done);

                    });
                }).catch(e => done());
            }).catch(e => done());
        });
    };
};