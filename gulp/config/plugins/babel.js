module.exports = {
    compact: false,
    presets: [
        ['@babel/env', {
            useBuiltIns: 'usage',
            corejs: 3
        }]
    ],
    plugins: [
        ['@babel/transform-runtime', {
            helpers: false,
            regenerator: true
        }]
    ]
};