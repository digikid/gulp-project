const { name, description, version, boilerplateVersion } = add('@/package.json');
const { concat } = add('@gulp/utils/params');

const root = '.';
const source = `${root}/src`;
const output = `${root}/dist`;

const params = concat('@gulp/config', {
    root,
    source,
    output
});

module.exports = {
    title: 'Новый проект',
    copyright: '',
    description,
    name,
    version,
    boilerplateVersion,
    ...params
};