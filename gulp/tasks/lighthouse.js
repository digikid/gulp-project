const fs = require(`fs`).promises;
const path = require(`path`);
const del = require(`del`);
const open = require(`open`);
const server = require(`browser-sync`).create();
const lighthouse = require(`lighthouse`);
const chromeLauncher = require(`chrome-launcher`);
const { write } = require(`lighthouse/lighthouse-cli/printer`);
const reportGenerator = require(`lighthouse/lighthouse-core/report/report-generator`);

module.exports = (gulp, plugins, config) => {
    return done => {

        async function getNameHTMLFiles() {
            const files = await fs.readdir(config.paths.output.root);

            return files.filter(item => item.endsWith(`.html`) && !item.includes(`index.html`));
        };

        async function launchChrome() {
            const chrome = await chromeLauncher.launch({
                chromeFlags: [
                    `--headless`, `--disable-gpu`, `--disable-extensions`
                ]
            });

            config.lighthouse.chromeLauncherPort = chrome.port;

            return chrome;
        };

        async function launchLighthouse(url) {
            const result = await lighthouse(url, {
                ...config.lighthouse.flags,
                port: config.lighthouse.chromeLauncherPort
            }, config.lighthouse.config);

            return result;
        };

        async function runLighthouse(fileName) {
            const result = await launchLighthouse(`http://localhost:${config.lighthouse.port}/${fileName}`);

            await write(reportGenerator.generateReportHtml(result.lhr), `html`, path.join(config.lighthouse.path, fileName));
        };

        async function generateReports(cb) {
            await del(config.lighthouse.path);
            await fs.mkdir(config.lighthouse.path);

            server.init({
                server: config.paths.output.root,
                port: config.lighthouse.port,
                notify: false,
                open: false,
                cors: true
            });

            const files = await getNameHTMLFiles();
            const chrome = await launchChrome();

            try {
                for (const file of files) {
                    await runLighthouse(file);
                    await open(path.join(config.lighthouse.path, file));
                };
            } catch (e) {
                console.error(e);
            };

            await chrome.kill();

            server.exit();

            cb();
        };

        gulp.series(`build`, generateReports)(done);
    };
};
