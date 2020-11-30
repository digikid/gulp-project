const imageminPngquant = require(`imagemin-pngquant`);
const imageminMozjpeg = require(`imagemin-mozjpeg`);
const imageminZopfli = require(`imagemin-zopfli`);
const imageminGiflossy = require(`imagemin-giflossy`);

const chalk = require(`chalk`);

module.exports = (gulp, plugins, config) => {
    return done => {

        if (config.debug) {
            console.log(`${chalk.bold(`Оптимизация и сжатие изображений...`)}`);
        };

        const imageminPlugins = {
            pngquant: imageminPngquant,
            mozjpeg: imageminMozjpeg,
            zopfli: imageminZopfli,
            giflossy: imageminGiflossy,
            gifsicle: plugins.imagemin.gifsicle,
            svgo: plugins.imagemin.svgo
        };

        const compress = Object.keys(config.plugins.imagemin).map(compressor => imageminPlugins[compressor](config.plugins.imagemin[compressor]));

        return gulp.src(config.paths.src.img)
            .pipe(plugins.changed(config.paths.output.img))
            .pipe(plugins.plumber())
            .pipe(plugins.cache(plugins.imagemin(compress)))
            .pipe(plugins.if(config.webp, plugins.webp()))
            .pipe(gulp.dest(config.paths.output.img));
    };
};