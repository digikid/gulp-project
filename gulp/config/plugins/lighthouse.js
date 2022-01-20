module.exports = {
    path: './reports',
    port: 8080,
    options: {
        extends: 'lighthouse:default'
    },
    flags: {
        lighthouse: {
            chromeFlags: ['--show-paint-rects'],
            output: 'html',
        },
        chrome: {
            chromeFlags: [
                `--headless`,
                `--disable-gpu`,
                `--disable-extensions`
            ]
        }
    }
};
