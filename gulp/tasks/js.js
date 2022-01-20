const chalk = require('chalk');

const del = require('del');
const through = require('through2');

const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const named = require('vinyl-named');

const webpack = require('webpack-stream');

const rollup = require('@rollup/stream');
const commonJS = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');

const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { babel: babelPlugin } = require('@rollup/plugin-babel');

const log = add('@gulp/core/log');

const { findDeep } = add('@gulp/utils/object');
const { removeLastSlash, trimAfter } = add('@gulp/utils/path');
const { isModule, merge } = add('@gulp/utils/stream');
const { scanDirectory } = add('@gulp/utils/fs');
const { defineName } = add('@gulp/utils/function');

module.exports = (gulp, plugins, config) => {
    const {
        paths: {
            src: {
                js: {
                    root,
                    main: input,
                    partials
                }
            },
            output: {
                js: dest
            }
        },
        files: {
            main: {
                js: main
            }
        },
        plugins: params,
        args: {
            sourcemaps: {
                js: maps
            },
            es6,
            babel,
            minify,
            mode
        },
        modules
    } = config;

    const {
        if: _if,
        plumber,
        concat,
        sourcemaps,
        rename,
        terser,
        fileInclude,
        beautify
    } = plugins;

    const fileIncludeConfig = {
        ...params.fileInclude,
        basepath: partials,
        context: {
            config
        }
    };

    const rollupPlugins = [
        replace({
            'preventAssignment': true,
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        nodeResolve(),
        commonJS()
    ];

    const buildWebpackConfig = (options = {}) => {
        const config = {
            mode: 'development',
            stats: 'errors-only',
            devtool: (maps ? 'source-map' : false)
        };

        return {
            ...config,
            ...options
        };
    };

    const webpackBabelConfig = {
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: params.babel
                }
            }]
        }
    };

    const babelPluginConfig = {
        ...params.babel,
        exclude: [
            /\/core-js\//
        ],
        skipPreflightCheck: true,
        babelHelpers: 'runtime'
    };

    return done => {
        log(`${chalk.bold('Сборка JS файлов...')}`);

        const getInputs = () => {
            const tree = scanDirectory(root, {
                extensions: ['js']
            });

            return findDeep(tree, ({ type, name }) => ((type === 'file') && (name.includes(`.${modules.postfix}`) || (name === input.replace(`${root}/`, ''))))).reduce((acc, { name, relativePath }) => {
                const path = (relativePath === name) ? name : `${removeLastSlash(relativePath.replace(name, ''))}/${name}`;

                acc.push(`${root}/${path}`);

                return acc;
            }, []);
        };

        const getOutputs = filter => {
            const tree = scanDirectory(dest, {
                depth: 1,
                extensions: ['js']
            });

            return tree.filter(({ type, name }) => (type === 'file' && !name.includes('.map'))).filter(({ name }) => {
                if (!filter) return true;

                const param = (name === `${main}.js`) ? config.args[filter] : modules[filter];

                return (typeof param === 'object' && ('js' in param)) ? param.js : param;
            }).reduce((acc, { name }) => {
                acc.push(`${dest}/${name}`);

                return acc;
            }, []);
        };

        const es5Stream = (input, fileName, isModule) => {
            return gulp.src(input)
                .pipe(fileInclude(fileIncludeConfig))
                .pipe(_if(!isModule, rename(path => ({
                    ...path,
                    basename: main
                }))))
        };

        const es6Stream = (input, fileName, isModule) => {
            let cache;

            let webpackConfig = buildWebpackConfig({
                output: {
                    filename: fileName
                }
            });

            if ((isModule && modules.babel) || (!isModule && babel)) {
                rollupPlugins.push(babelPlugin(babelPluginConfig));

                webpackConfig = {
                    ...webpackConfig,
                    ...webpackBabelConfig
                };
            };

            const rollupConfig = {
                input,
                cache,
                plugins: rollupPlugins,
                output: {
                    format: 'iife',
                    sourcemap: maps
                }
            };

            const rollupStream = () => rollup(rollupConfig)
                .on('bundle', bundle => {
                    cache = bundle;
                })
                .pipe(source(fileName))
                .pipe(buffer());

            const webpackStream = () => gulp.src(input)
                .pipe(named())
                .pipe(webpack(webpackConfig));

            return ((mode === 'build') ? rollupStream : webpackStream)();
        };

        const inputs = getInputs();

        const sources = merge(inputs.map(input => {
            const path = input.replace(`${root}/`, '');
            const name = path.includes('/') ? trimAfter(path, '/') : path;
            const isModule = name.includes(`.${modules.postfix}`);
            const fileName = isModule ? name : `${main}.js`;
            const stream = es6 ? es6Stream : es5Stream;

            return stream(input, fileName, isModule);
        }));

        const isBeautify = file => {
            if (!es6) {
                if (isModule(file)) {
                    return (!modules.minify.js && !modules.babel);
                } else {
                    return (!minify.js && !babel);
                };
            };

            return false;
        };

        const compile = defineName('js:compile', done => sources
            .pipe(plugins.plumber())
            .pipe(_if(maps, sourcemaps.init({
                loadMaps: true
            })))
            .pipe(through.obj(function(file, enc, cb) {
                const isSourceMap = /\.map$/.test(file.path);

                if (!isSourceMap) this.push(file);

                cb();
            }))
            .pipe(_if(isBeautify, beautify(params.beautify.js)))
            .pipe(_if(isModule, rename(path => ({
                ...path,
                basename: path.basename.replace(`.${modules.postfix}`, '')
            }))))
            .pipe(_if(maps, sourcemaps.write('.')))
            .pipe(gulp.dest(dest))
            .on('end', done));

        const babelify = defineName('js:babel', done => {
            const outputs = getOutputs('babel');

            if (outputs.length) {
                return gulp.src(outputs)
                    .pipe(plumber())
                    .pipe(named())
                    .pipe(webpack(buildWebpackConfig(webpackBabelConfig)))
                    .pipe(gulp.dest(dest))
                    .on('end', done);
            } else {
                done();
            };
        });

        const compress = defineName('js:minify', done => {
            const outputs = getOutputs('minify');

            if (outputs.length) {
                return gulp.src(outputs)
                    .pipe(plumber())
                    .pipe(terser(params.terser))
                    .pipe(rename(path => path.basename += '.min'))
                    .pipe(gulp.dest(dest))
                    .on('end', async () => {
                        await del(outputs);

                        done();
                    });
            } else {
                done();
            };
        });

        const tasks = [compile];

        if (!es6 && (babel || modules.babel)) {
            tasks.push(babelify);
        };

        if (minify.js || modules.minify.js) {
            tasks.push(compress);
        };

        return gulp.series(...tasks)(done);
    };
};
