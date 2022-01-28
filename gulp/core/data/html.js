const { readFile } = add('@gulp/utils/fs');
const { trimExt } = add('@gulp/utils/path');
const { getHtmlTitle } = add('@gulp/utils/string');
const { scanDirectory } = add('@gulp/utils/fs');

const config = add('@gulp/core/config');

module.exports = async () => {
    const {
        paths,
        abstract,
        aliases: {
            html: aliases
        }
    } = config;

    const {
        order: {
            first,
            last
        }
    } = abstract;

    const tree = scanDirectory(paths.output.root, {
        depth: 1,
        matches: [/\.html/],
        extensions: ['html']
    });

    const files = [];

    for (const file of tree) {
        const { name, relativePath, extension: type } = file;
        const { untitled } = aliases;

        const alias = trimExt(name);

        const data = await readFile(`${paths.output.root}/${name}`);

        const title = (alias in aliases) ? aliases[alias] : getHtmlTitle(data, untitled);

        const path = `../${name}`;

        files.push({
            name,
            path,
            type,
            title
        });
    };

    let arr = [...files];
    let start;
    let end;

    if (Array.isArray(first) && first.length) {
        start = arr.filter(({ name }) => first.includes(name)).sort((a, b) => first.indexOf(a.name) - first.indexOf(b.name));
        end = arr.filter(({ name }) => !first.includes(name));

        arr = [...start, ...end];
    };

    if (Array.isArray(last) && last.length) {
        start = arr.filter(({ name }) => !last.includes(name));
        end = arr.filter(({ name }) => last.includes(name)).sort((a, b) => last.indexOf(a.name) - last.indexOf(b.name));

        arr = [...start, ...end];
    };

    return arr;
};
