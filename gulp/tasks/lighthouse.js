const fs = require(`fs`).promises;
const path = require(`path`);
const del = require(`del`);
const open = require(`open`);
const server = require(`browser-sync`).create();
const lighthouse = require(`lighthouse`);
const chromeLauncher = require(`chrome-launcher`);
const { write } = require(`lighthouse/lighthouse-cli/printer`);
const reportGenerator = require(`lighthouse/lighthouse-core/report/report-generator`);
const chalk = require(`chalk`);

module.exports = (gulp, plugins, config) => {
    return done => {

        if (config.debug) {
            console.log(`${chalk.bold(`Формирование отчетов Lighthouse...`)}`);
        };

        const params = config.plugins.lighthouse;

        async function getNameHTMLFiles() {
            const files = await fs.readdir(config.paths.output.root);

            return config.open ? [`${config.open}.html`] : files.filter(item => item.endsWith(`.html`) && !item.includes(`index.html`));
        };

        async function launchChrome() {
            const chrome = await chromeLauncher.launch({
                chromeFlags: [
                    `--headless`,
                    `--disable-gpu`,
                    `--disable-extensions`
                ]
            });

            params.chromeLauncherPort = chrome.port;

            return chrome;
        };

        async function launchLighthouse(url) {
            const result = await lighthouse(url, {
                ...params.flags,
                port: params.chromeLauncherPort
            }, params.config);

            return result;
        };

        async function runLighthouse(fileName) {
            const result = await launchLighthouse(`http://localhost:${params.port}/${fileName}`);

            await write(reportGenerator.generateReportHtml(result.lhr), `html`, path.join(params.path, fileName));
        };

        async function generateReports(cb) {
            await del(params.path);
            await fs.mkdir(params.path);

            server.init({
                server: config.paths.output.root,
                port: params.port,
                notify: false,
                open: false,
                cors: true
            });

            const files = await getNameHTMLFiles();
            const chrome = await launchChrome();

            try {
                for (const file of files) {
                    await runLighthouse(file);
                    await open(path.join(params.path, file));
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
