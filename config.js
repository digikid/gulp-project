module.exports = {
    presets: {
        global: {
            index: true
        },
        build: {
            debug: true
        },
        deploy: {
            babel: true,
            compress: true,
            mode: `build`
        },
    }
};