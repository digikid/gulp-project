module.exports = ({ output }) => ({
    root: `${output}`,
    css: `${output}/css`,
    js: `${output}/js`,
    html: `${output}`,
    images: `${output}/images`,
    abstract: {
        root: `${output}/abstract`,
        css: `${output}/abstract/css`,
        images: `${output}/abstract/images`
    }
});