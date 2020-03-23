const imageminPngquant = require(`imagemin-pngquant`);
const imageminMozjpeg = require(`imagemin-mozjpeg`);
const imageminZopfli = require(`imagemin-zopfli`);
const imageminGiflossy = require(`imagemin-giflossy`);

module.exports = (gulp, plugins, config) => {
    return done => {

        const imageminPlugins = {
            pngquant: imageminPngquant,
            mozjpeg: imageminMozjpeg,
            zopfli: imageminZopfli,
            giflossy: imageminGiflossy,
            gifsicle: plugins.imagemin.gifsicle,
            svgo: plugins.imagemin.svgo,
            jpegtran: plugins.imagemin.jpegtran
        };

        const compress = Object.keys(config.compressors).map(compressor => imageminPlugins[compressor](config.compressors[compressor]));

        return gulp.src(config.paths.src.img)
            .pipe(plugins.changed(config.paths.output.img))
            .pipe(plugins.plumber())
            .pipe(plugins.cache(plugins.imagemin(compress)))
            .pipe(plugins.if(config.webp, plugins.webp()))
            .pipe(gulp.dest(config.paths.output.img));
    };
};