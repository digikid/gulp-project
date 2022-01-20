module.exports = ({ source }) => ({
    root: `${source}/**`,
    sass: `${source}/styles/**/*.{scss,sass}`,
    js: `${source}/js/**/*.{js,json}`,
    html: [
        `${source}/**/*.{html,json}`,
        `!${source}/abstract/**`,
        `!${source}/icomoon/**`
    ],
    images: `${source}/images/**`,
    vectors: `${source}/vectors/**`,
    assets: [
        `${source}/{fonts,vendor,templates,video,upload,ajax}/**`,
        `${source}/**/*.php`
    ],
    icomoon: `${source}/icomoon/**`,
    abstract: [
        `${source}/abstract/**`,
        `!${source}/abstract/data/**`
    ]
});