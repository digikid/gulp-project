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
        index: false,
        debug: false,
        preset: `global`,
        open: `index`,
        host: `default`,
        mode: `dev`
    },
    presets: {
        deploy: {
            babel: true,
            compress: true,
            mode: `build`
        },
        lighthouse: {
            compress: true
        }
    }
};