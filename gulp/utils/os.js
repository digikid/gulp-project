const os = require('os');

const browser = (os.platform() === 'linux' || os.platform() === 'darwin') ? 'google chrome' : (os.platform() === 'win32') ? 'chrome' : 'firefox';

module.exports = {
    browser
};