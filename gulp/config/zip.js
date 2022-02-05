const { name } = add('@/package.json');

module.exports = ({ source, output }) => ({
    src: {
        name: `${name}-src.zip`,
        title: 'Архив с исходными файлами',
        src: [
            './**',
            '!./**/DS_Store',
            '!.idea/**',
            '!.git/**',
            '!node_modules/**',
            `!${source}/abstract/data/**`,
            '!dist/**',
            '!reports/**',
            '!psd/**'
        ],
        dest: [output]
    },
    output: {
        name: `${name}-dist.zip`,
        title: 'Архив с версткой',
        src: [
            `${output}/**`
        ],
        dest: [output]
    }
});