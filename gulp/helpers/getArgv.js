const argv = require(`yargs`).argv;

module.exports = a => argv[a] !== undefined ? argv[a] : false;