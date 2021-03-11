module.exports = {
    args: {
        merge: {
            css: false,
            js: false
        },
        minify: {
            css: false,
            js: false
        },
        babel: false,
        compress: false,
        sourcemaps: false,
        webp: false,
        zip: false,
        main: false,
        force: false,
        index: false,
        debug: false,
        preset: `global`,
        open: `index`,
        host: `default`,
        mode: `dev`
    },
    presets: {
        lighthouse: {
            compress: true
        }
    }
};