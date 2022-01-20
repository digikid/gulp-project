module.exports = ({ output }) => ({
    source: `${output}/**/*`,
    force: {
        css: `${output}/css/**`,
        js: `${output}/js/**`,
        html: [`${output}/*.html`, `${output}/templates/**`],
        img: `${output}/images/**`,
        abstract: `${output}/abstract/**`
    }
});