const { createDirectory, writeFile } = add('@gulp/utils/fs');

const config = add('@gulp/core/config');

module.exports = async () => {
    const {
        paths: {
            src: {
                abstract: {
                    data: path
                }
            }
        }
    } = config;

    const tasks = [
        'authors',
        'files',
        'html',
        'modules',
        'dependencies',
        'zip'
    ];

    const data = tasks.reduce((acc, task) => {
        acc[task] = [];
        acc.total[task] = 0;

        return acc;
    }, {
        total: {}
    });

    try {
        await createDirectory(path);

        for (const task of tasks) {
            const json = await add(`@gulp/core/data/${task}`)();

            await writeFile(`${path}/${task}.json`, JSON.stringify(json));

            data[task] = json;
            data.total[task] = json.length;
        };
    } catch(e) {
        console.log(e);
    };

    return data;
};
