const gulp = require('gulp');
const es = require('event-stream');

const { modules: { postfix } } = add('@gulp/core/config');

const isModule = ({ basename }) => basename.includes(`.${postfix}`);

const merge = tasks => es.merge.apply(null, tasks);

module.exports = {
    isModule,
    merge
};