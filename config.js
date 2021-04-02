module.exports = {
    presets: {
        global: {
            index: true
        },
        build: {
            debug: true,
            open: `home`
        },
        deploy: {
            babel: true,
            compress: true,
            mode: `build`
        }
    }
};