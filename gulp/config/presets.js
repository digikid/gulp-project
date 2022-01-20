module.exports = {
    build: {
        debug: true
    },
    deploy: {
        mode: 'build',
        abstract: true,
        babel: true,
        minify: {
            css: true,
            js: true
        },
        modules: {
            babel: true,
            minify: {
                css: true,
                js: true
            }
        }
    },
    reports: {
        minify: {
            css: true,
            js: true
        },
        modules: {
            minify: {
                css: true,
                js: true
            }
        }
    }
};