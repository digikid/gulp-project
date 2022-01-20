module.exports = ({ source }) => ({
    root: source,
    sass: {
        root: `${source}/styles`,
        main: `${source}/styles/**/*.{scss,sass}`
    },
    js: {
        root: `${source}/js`,
        main: `${source}/js/main.js`,
        partials: `${source}/js`
    },
    html: {
        root: source,
        main: `${source}/*.html`,
        partials: `${source}/partials`
    },
    images: `${source}/images/**`,
    assets: [
        `${source}/{fonts,vendor,templates,video,upload,ajax}/**`,
        `${source}/**/*.php`
    ],
    icomoon: {
        root: `${source}/icomoon`,
        fonts: `${source}/icomoon/fonts/**`,
        json: `${source}/icomoon/selection.json`,
        sass: `${source}/styles/partials/_icomoon.scss`
    },
    abstract: {
        root: `${source}/abstract`,
        data: `${source}/abstract/data`,
        partials: `${source}/abstract/partials`,
        html: `${source}/abstract/*.html`,
        sass: `${source}/abstract/styles/**/*.{scss,sass}`,
        images: `${source}/abstract/images/**`
    },
    data: `${source}/data`
});