const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

const { generateReportHtml } = require('lighthouse/lighthouse-core/report/report-generator');
const { write } = require('lighthouse/lighthouse-cli/printer');

const config = add('@gulp/core/config');

const {
    paths: {
        output: {
            root: output
        }
    },
    plugins: {
        lighthouse: params
    }
} = config;

const {
    path,
    port,
    flags,
    options
} = params;

let chromeLauncherPort;

const launchChrome = async () => {
    const chrome = await chromeLauncher.launch({
        ...flags.chrome
    });

    chromeLauncherPort = chrome.port;

    return chrome;
};

const launchLighthouse = async fileName => {
    const url = `http://localhost:${port}/${fileName}`;
    const dest = `${path}/${fileName}`;

    const result = await lighthouse(url, {
        ...flags.lighthouse,
        port: chromeLauncherPort
    }, options);

    await write(generateReportHtml(result.lhr), 'html', dest);

    return dest;
};

module.exports = {
    launchChrome,
    launchLighthouse
};