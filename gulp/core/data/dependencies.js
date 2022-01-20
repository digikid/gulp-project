const { dependencies } = add('@/package.json');
const { packages } = add('@/package-lock.json');

module.exports = () => {
    const arr = Object.entries(dependencies).map(([title, ver]) => {
        const dest = `node_modules/${title}`;
        const version = (dest in packages) ? packages[dest].version : ver.replace('^', '');
        const type = title.includes('css') ? 'css' : 'js';

        return {
            title,
            version,
            type
        };
    });

    return arr;
};
