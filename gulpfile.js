global.add = path => require(path.replace('@', `${__dirname}/`).replace('//', '/'));

require('dotenv').config();
require('./gulp');