const { name } = add('@/package.json');

module.exports = {
    main: {
        css: 'build',
        js: 'build'
    },
    abstract: {
        css: 'style'
    },
    zip: {
        src: `${name}-src`,
        output: `${name}-dist`
    }
};