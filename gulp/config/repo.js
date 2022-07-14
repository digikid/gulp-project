const { repository } = add('@/package.json');
const { trimExt } = add('@gulp/utils/path');

const repo = trimExt(repository.url);

module.exports = repo;