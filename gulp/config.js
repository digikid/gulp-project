const pjson = require(`../package.json`);
const date = require(`./helpers/date`);
const args = require(`./helpers/args`);

module.exports = {
    title: `{{title}}`,
    name: pjson.name,
    description: pjson.description,
    now: date(),
    files: {
        bootstrap: `bootstrap.custom.min.css`,
        css: `build.css`,
        js: `build.js`,
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
                    `./src/javascripts/*.{js,json}`
                ],
                components: `./src/javascripts/components/**/*.{js,json}`,
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
            import: `.src/import/modules.json`,
            common: {
                root: `./src/common`,
                data: `./src/common/data`,
                sass: `./src/common/styles`,
                partials: `./src/common/includes`
            }
        },
        output: {
            root: `./dist`,
            css: `./dist/css`,
            js: `./dist/js`,
            img: `./dist/images`,
            vendor: `./dist/vendor`
        },
        watch: {
            root: `./src/**/*.*`,
            sass: {
                root: [
                    `./src/styles/**/*.{scss,sass}`,
                    `!./src/styles/vendor/bootstrap/**`
                ],
                bootstrap: `./src/styles/vendor/bootstrap/**/*.{scss,sass}`
            },
            js: `./src/javascripts/**/*.{js,json}`,
            html: [`./src/**/*.{html,json}`, `!./src/common/**`, `!./src/icomoon/**/*.*`],
            img: `./src/images/**/*.*`,
            vectors: `./src/vectors/**/*.*`,
            steady: [
                `./src/fonts/**/*.*`,
                `./src/templates/**/*.*`,
                `./src/video/**/*.*`,
                `./src/upload/**/*.*`,
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
        deploy: {
            source: `./dist/**/*`,
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
    ...args
};