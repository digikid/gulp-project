const pjson = require(`../package.json`);
const args = require(`./helpers/args`);

module.exports = {
    title: `Новый проект`,
    name: pjson.name,
    files: {
        bootstrap: `bootstrap.custom.min.css`,
        css: `build.css`,
        js: `build.js`,
        polyfills: `polyfills.js`,
        zip: {
            src: `${pjson.name}-src.zip`,
            output: `${pjson.name}-dist.zip`
        }
    },
    common: {
        theme: `default`,
        aliases: [{
            title: `Главная страница`,
            name: `home.html`
        }, {
            title: `Каталог`,
            name: `catalog.html`
        }, {
            title: `Карточка объекта`,
            name: `card.html`
        }, {
            title: `Статья`,
            name: `article.html`
        }, {
            title: `Страница не найдена`,
            name: `404.html`
        }],
        files: {
            css: `Таблица стилей CSS`,
            js: `Файл JavaScript`,
            src: `Архив с исходными файлами`,
            output: `Архив с версткой`,
            html: `Новая страница`
        },
        import: `Подключаемые компоненты`,
        first: [`home.html`],
        last: [`404.html`, `template.html`, `ui.html`],
        authors: [{
            name: `Александр Довлатов`,
            job: `Верстальщик`,
            contacts: [{
                title: `@digikid`,
                href: `https://t.me/digikid`
            }]
        }],
        copyright: `Интернет-агентство «Relevant»`
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
                    `./src/javascripts/base/**/*.{js,json}`,
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
            img: `./src/images/**/*.*`,
            steady: [
                `./src/fonts/**/*.*`,
                `./src/templates/**/*.*`,
                `./src/import/**/*.*`,
                `./src/video/**/*.*`,
                `./src/upload/**/*.*`,
                `./src/ajax/**/*.*`,
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
            import: `.src/import/modules.json`
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
            root: `./src/**/*.*`,
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
                `!./src/icomoon/**/*.*`
            ],
            img: `./src/images/**/*.*`,
            vectors: `./src/vectors/**/*.*`,
            steady: [
                `./src/fonts/**/*.*`,
                `./src/templates/**/*.*`,
                `./src/import/**/*.*`,
                `./src/video/**/*.*`,
                `./src/upload/**/*.*`,
                `./src/ajax/**/*.*`,
                `./src/**/*.php`
            ],
            icomoon: `./src/icomoon/**/*.*`,
            vendor: `./src/vendor/**/*.*`,
            common: [
                `./src/common/**/*.html`,
                `./src/common/styles/**/*.scss`,
                `./src/common/images/*.*`
            ]
        },
        vendor: {
            device: [
                `./node_modules/js.device.detector/dist/jquery.device.detector.min.js`
            ],
            jquery: [
                `./node_modules/jquery/dist/jquery.min.js`
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
            swiper: [
                `./node_modules/swiper/js/swiper.min.js`
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
            main: `./dist/**/*.{html,css,js}`,
            base: `dist/`
        },
        clean: `./dist`
    },
    webserver: {
        server: {
            baseDir: `./dist`
        },
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
    compressors: {
        jpegtran: {
            progressive: true
        },
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
    repo: pjson.repository.url.replace(`.git`, ``),
    icomoon: [],
    ...args
};