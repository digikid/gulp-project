const pjson = require(`../package.json`);
const args = require(`./helpers/args`);
const now = require(`./helpers/now`);

const {
    FTP_HOST,
    FTP_USER,
    FTP_PASSWORD,
    FTP_DEST,
    FTP_URI
} = process.env;

module.exports = {
    title: `Новый проект`,
    name: pjson.name,
    description: ``,
    version: pjson.version,
    repo: pjson.repository.url.replace(`.git`, ``),
    icomoon: [],
    files: {
        bootstrap: `bootstrap.custom.min.css`,
        css: `build.css`,
        js: `build.js`,
        polyfills: `polyfills.min.js`,
        zip: {
            src: `${pjson.name}-src.zip`,
            output: `${pjson.name}-dist.zip`
        }
    },
    common: {
        theme: `default`,
        files: {
            css: `Таблица стилей CSS`,
            js: `Файл JavaScript`,
            src: `Архив с исходными файлами`,
            output: `Архив с версткой`,
            html: `Новая страница`
        },
        aliases: {
            home: `Главная страница`,
            catalog: `Каталог`,
            404: `Страница не найдена`
        },
        import: `Подключаемые компоненты`,
        first: [`home.html`],
        last: [`404.html`, `template.html`, `ui.html`],
        authors: [],
        copyright: ``
    },
    paths: {
        root: `./`,
        src: {
            root: `./src`,
            sass: {
                root: [
                    `./src/styles/**/*.{scss,sass}`,
                    `!./src/styles/vendor/**`
                ],
                base: [
                    `./src/styles/*.{scss,sass}`,
                    `./src/styles/base/**/*.{scss,sass}`
                ],
                components: `./src/styles/components/*.{scss,sass}`,
                partials: `./src/styles/partials/`,
                vendor: `./src/styles/vendor/*.{scss,sass}`,
                bootstrap: `./src/styles/vendor/bootstrap/bootstrap.scss`,
                config: `./src/styles/_config.scss`
            },
            js: {
                root: `./src/javascripts/**/*.{js,json}`,
                base: [
                    `./src/javascripts/base/*.{js,json}`,
                    `./src/javascripts/*.{js,json}`,
                    `!./src/javascripts/polyfills/**/*.{js,json}`
                ],
                components: `./src/javascripts/components/**/*.{js,json}`,
                polyfills: `./src/javascripts/polyfills/**/*.{js,json}`,
                partials: `./src/javascripts/`
            },
            html: {
                root: `./src/*.html`,
                partials: `./src/includes/`
            },
            pug: {
                root: `./src/pug/*.pug`,
                partials: `./src/pug/includes/`
            },
            img: `./src/images/**`,
            steady: [
                `./src/fonts/**`,
                `./src/templates/**`,
                `./src/video/**`,
                `./src/upload/**`,
                `./src/ajax/**`,
                `./src/**/*.php`
            ],
            icomoon: {
                root: `./src/icomoon`,
                fonts: `./src/icomoon/fonts/*.*`,
                json: `./src/icomoon/selection.json`,
                fileName: `_icomoon.scss`,
                output: `./src/styles/icons`
            },
            vendor: `./src/vendor`,
            common: {
                root: `./src/common`,
                data: `./src/common/data`,
                sass: `./src/common/styles`,
                partials: `./src/common/includes`
            },
            data: `./src/data`
        },
        output: {
            root: `./dist`,
            css: `./dist/css`,
            js: `./dist/js`,
            img: `./dist/images`,
            vendor: {
                root: `./dist/vendor`,
                css: `./dist/vendor/css`,
                js: `./dist/vendor/js`
            }
        },
        watch: {
            root: `./src/**`,
            sass: {
                root: [
                    `./src/styles/**/*.{scss,sass}`,
                    `!./src/styles/vendor/bootstrap/**`
                ],
                bootstrap: [
                    `./src/styles/_config.scss`,
                    `./src/styles/vendor/bootstrap/**/*.{scss,sass}`
                ]
            },
            js: `./src/javascripts/**/*.{js,json}`,
            html: [
                `./src/**/*.{html,json}`,
                `./src/includes/**`,
                `!./src/common/**`,
                `!./src/icomoon/**`
            ],
            pug: `./src/**/*.pug`,
            img: `./src/images/**`,
            vectors: `./src/vectors/**`,
            steady: [
                `./src/fonts/**`,
                `./src/templates/**`,
                `./src/video/**`,
                `./src/upload/**`,
                `./src/ajax/**`,
                `./src/**/*.php`
            ],
            icomoon: `./src/icomoon/**`,
            vendor: `./src/vendor/**`,
            common: [
                `./src/common/**/*.html`,
                `./src/common/styles/**/*.scss`,
                `./src/common/images/*.*`
            ]
        },
        vendor: {
            animateCSS: [
                `./node_modules/animate.css/animate.css`
            ],
            jquery: [
                `./node_modules/jquery/dist/jquery.min.js`
            ],
            device: [
                `./node_modules/js.device.detector/dist/jquery.device.detector.min.js`
            ],
            fancybox: [
                `./node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js`,
                `./node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.css`
            ],
            simplebar: [
                `./node_modules/simplebar/dist/simplebar.min.js`,
                `./node_modules/simplebar/dist/simplebar.min.css`
            ],
            lozad: [
                `./node_modules/lozad/dist/lozad.min.js`
            ],
            mask: [
                `./node_modules/jquery-mask-plugin/dist/jquery.mask.min.js`
            ],
            datepicker: [
                `./node_modules/air-datepicker/dist/js/datepicker.min.js`
            ],
            swiper: [
                `./node_modules/swiper/swiper-bundle.min.js`
            ],
            popper: [
                `./node_modules/@popperjs/core/dist/umd/popper.min.js`
            ],
            tippy: [
                `./node_modules/tippy.js/dist/tippy.umd.min.js`,
                `./node_modules/tippy.js/dist/tippy.css`
            ]
        },
        deploy: {
            source: `./dist/**/*`,
            main: `./dist/**/*.{html,css,js,hbs}`,
            base: `dist/`
        },
        temp: [`./temp`],
        clean: [`./dist`, `./temp`, `./reports`]
    },
    plugins: {
        webserver: {
            server: {
                baseDir: `./dist`
            },
            open: `external`,
            startPath: `/${args.open}.html`,
            tunnel: false,
            online: true,
            host: `localhost`,
            ghostMode: false,
            port: 9002,
            logPrefix: `app_dev`
        },
        lighthouse: {
            path: `./reports`,
            port: 8080,
            chromeLauncherPort: 9222,
            config: {
                extends: `lighthouse:default`
            },
            flags: {
                chromeFlags: [`--show-paint-rects`],
                output: `html`
            }
        },
        imagemin: {
            mozjpeg: {
                progressive: true,
                quality: 90
            },
            pngquant: {
                speed: 1,
                quality: [0.95, 1]
            },
            svgo: {
                plugins: [{
                    removeViewBox: false
                }]
            },
            giflossy: {
                optimizationLevel: 3,
                optimize: 3,
                lossy: 2
            }
        },
        sass: {
            outputStyle: `expanded`,
            errLogToConsole: true
        },
        base64: {
            exclude: [
                `/sprite/`,
                `/images/`,
                `/symbols/`,
                `/vendor/`
            ]
        },
        cleanCss: {},
        inject: {
            ignorePath: `dist/`,
            addRootSlash: false,
            removeTags: true,
            empty: true
        },
        beautify: {
            html: {
                max_preserve_newlines: 5,
                end_with_newline: true,
                indent_inner_html: true,
                space_before_conditional: true,
                indent_empty_lines: true
            },
            js: {
                indent_size: 4,
                max_preserve_newlines: 2
            }
        },
        terser: {
            output: {
                comments: false
            }
        },
        babelify: {
            presets: [
                [`@babel/env`]
            ],
            plugins: [
                [`@babel/transform-runtime`]
            ],
            compact: false
        },
        icomoonBuilder: {
            templateType: `map`
        }
    },
    ftp: {
        default: {
            host: FTP_HOST,
            user: FTP_USER,
            password: FTP_PASSWORD,
            dest: FTP_DEST,
            uri: FTP_URI
        }
    },
    now,
    ...args
};
