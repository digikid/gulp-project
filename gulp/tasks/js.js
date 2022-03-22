const chalk = require('chalk');

const del = require('del');
const through = require('through2');

const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const named = require('vinyl-named');

const webpackStream = require('webpack-stream');
const terserWebpackPlugin = require('terser-webpack-plugin');

const rollupStream = require('@rollup/stream');
const rollupCommonJSPlugin = require('@rollup/plugin-commonjs');
const rollupReplacePlugin = require('@rollup/plugin-replace');

const { nodeResolve: rollupNodeResolvePlugin } = require('@rollup/plugin-node-resolve');
const { babel: rollupBabelPlugin } = require('@rollup/plugin-babel');
const { terser: rollupTerserPlugin } = require('rollup-plugin-terser');

const log = add('@gulp/core/log');

const { findDeep } = add('@gulp/utils/object');
const { removeLastSlash, trimAfter } = add('@gulp/utils/path');
const { isModule, merge } = add('@gulp/utils/stream');
const { scanDirectory } = add('@gulp/utils/fs');

module.exports = (gulp, plugins, config) => {
    const {
        paths: {
            src: {
                js: {
                    root,
                    main: mainInput
                }
            },
            output: {
                js: dest
            }
        },
        files: {
            main: {
                js: mainOutput
            }
        },
        plugins: params,
        args,
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

    const maps = args.sourcemaps.js;
    const postfix = `.${modules.postfix}`;

    return done => {
        log(`${chalk.bold('Сборка JS файлов...')}`);

        const tree = scanDirectory(root, {
            extensions: ['js']
        });

        const modulesInput = findDeep(tree, ({ name, type }) => (type === 'file') && (name.includes(postfix))).map(({ relativePath }) => `${root}/${relativePath}`);

        const inputs = [mainInput, ...modulesInput];

        const getStreamParams = input => {
            const path = input.replace(`${root}/`, '');
            const name = path.includes('/') ? trimAfter(path, '/') : path;
            const isModule = name.includes(postfix);

            const isBabelified = isModule ? modules.babel : args.babel;
            const isMinified = isModule ? modules.minify.js : args.minify.js;

            const outputBase = isModule ? name.replace(postfix, '') : `${mainOutput}.js`;
            const outputName = isMinified ? outputBase.replace('.js', '.min.js'): outputBase;

            return {
                outputName,
                isBabelified,
                isMinified
            };
        };

        const setupWebpackStream = input => {
            const {
                isBabelified,
                isMinified,
                outputName
            } = getStreamParams(input);

            const config = {
                mode: isMinified ? 'production' : 'development',
                stats: 'errors-only',
                devtool: (maps ? 'source-map' : false),
                output: {
                    filename: outputName
                }
            };

            if (isBabelified) {
                config.module = {
                    rules: [{
                        test: /\.js$/,
                        exclude: /core-js/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                sourceType: 'unambiguous',
                                ...params.babel
                            }
                        }
                    }]
                };
            };

            if (isMinified) {
                config.optimization = {
                    minimize: true,
                    minimizer: [
                        new terserWebpackPlugin({
                            extractComments: false,
                            parallel: true,
                            terserOptions: params.terser
                        })
                    ]
                };
            };

            return gulp.src(input)
                .pipe(named())
                .pipe(webpackStream(config));
        };

        const setupRollupStream = input => {
            const {
                isBabelified,
                isMinified,
                outputName
            } = getStreamParams(input);

            const plugins = [
                rollupReplacePlugin({
                    'preventAssignment': true,
                    'process.env.NODE_ENV': JSON.stringify('production')
                }),
                rollupNodeResolvePlugin(),
                rollupCommonJSPlugin()
            ];

            let cache;

            if (isBabelified) {
                plugins.push(
                    rollupBabelPlugin({
                        ...params.babel,
                        exclude: [
                            /\/core-js\//
                        ],
                        skipPreflightCheck: true,
                        babelHelpers: 'runtime'
                    })
                );
            };

            if (isMinified) {
                plugins.push(rollupTerserPlugin(params.terser));
            };

            return rollupStream({
                input,
                cache,
                plugins,
                output: {
                    name: outputName,
                    format: 'iife',
                    sourcemap: maps
                }
            })
            .on('bundle', bundle => {
                cache = bundle;
            })
            .pipe(source(outputName))
            .pipe(buffer());
        };

        const streams = inputs.map(input => args.rollup ? setupRollupStream(input) : setupWebpackStream(input));

        return merge(streams)
            .pipe(plugins.plumber())
            .pipe(_if(maps, sourcemaps.init({
                loadMaps: true
            })))
            .pipe(through.obj(function(file, enc, cb) {
                const isSourceMap = /\.map$/.test(file.path);

                if (!isSourceMap) this.push(file);

                cb();
            }))
            .pipe(_if(maps, sourcemaps.write('.')))
            .pipe(rename({dirname: ''}))
            .pipe(gulp.dest(dest))
            .on('end', done);
    };
};