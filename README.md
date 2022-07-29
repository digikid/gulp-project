<div align="center">
  <img alt="Gulp Project" src="https://github.com/digikid/gulp-project/raw/main/logo.svg" height="117" />
</div>

<div align="center">
  <h1>Gulp Project</h1>
  <p>Automated project build with Gulp and Webpack.</p>
  <p><b>English</b> | <a href="https://github.com/digikid/gulp-project/blob/main/README.ru-RU.md">Русский</a></p>
  <img src="https://img.shields.io/github/release/digikid/gulp-project.svg?style=flat-square&logo=appveyor" alt="Release version">
  <img src="https://img.shields.io/github/languages/top/digikid/gulp-project.svg?style=flat-square&logo=appveyor" alt="TypeScript">
  <img src="https://img.shields.io/github/license/digikid/gulp-project.svg?style=flat-square&logo=appveyor" alt="MIT License">
</div>

## Table of contents

- [Features](#about)
- [System requirements](#requirements)
- [Setup](#setup)
- [Initialization](#build)
- [Project structure](#structure)
- - [Config files](#config-files)
- [Common params](#params)
- - [Run with cli params](#command-line)
- - [Presets](#presets)
- [Working with files](#process)
- - [HTML files](#html)
- - [SASS / SCSS files](#sass)
- - [JS files](#js)
- - [Images](#images)
- - [Convert SVG to Base64](#svg-base64)
- - [Icomoon Icons](#icomoon)
- - [Templates (Handlebars, Mustache)](#templates)
- [Deploy](#deploy)
- - [Adding FTP host](#add-ftp-host)
- - [Force upload](#force-upload)
- - [Production mode](#production-mode)
- [Creating ZIP archives](#zip)
- [Audit with PageSpeed Insights](#reports)

<a name="about"></a>

## Features

- Import data from JSON files and templating HTML (import, iteration, etc).
- Compiling SASS / SCSS files to CSS, adding browser prefixes, grouping media queries.
- Import and export of ECMAScript modules inside JS files.
- Transpiling JS files to ES5 using [Babel](https://babeljs.io/) (optional).
- Building JS files using [Rollup](https://rollupjs.org/) (optional).
- Optimization and compression of raster (JPG, PNG, GIF) and vector (SVG) images.
- Convert SVG files to Base64 and then import to CSS (optional).
- Convert images to WebP format (optional).
- Automatic import of Icomoon icons in SASS/SCSS from `selection.json` file.
- Watching and automatic recompilation of files.
- Generation abstract page with list of project files and used dependencies (optional).
- Linting SASS and JS files with Stylelint and ESLint.
- Sourcemaps generation (optional).
- Creating ZIP archives with source and compiled files (optional).
- Uploading project files to server via FTP (optional).
- PageSpeed Insights reports on the local server (optional).

<a name="requirements"></a>

## System requirements

- [Node.js 14+](https://nodejs.org/en/)
- [gulp-cli](https://gulpjs.com/docs/en/getting-started/quick-start/)

For image compression you will additionally need to install the following libraries:

### Mac OS

```shell
brew install libjpeg libpng
```

### Ubuntu

```shell
apt-get install -y libjpeg libpng
```

<a name="setup"></a>

## Setup

You can configure common params using [configurator](https://github.com/digikid/create-project) or define them yourself in `/config.js` file.

<a name="build"></a>

## Initialization

Go to project directory and install required dependencies:

```shell
npm ci
```

After that, start building:

```shell
gulp
```

<a name="structure"></a>

## Project structure

```
gulp-project                        # Root directory
├── gulp                            # Gulp files
│   └── config                      # Global params
├── src                             # Source files
│   ├── abstract                    # Source files for abstract page
│   ├── data                        # JSON files
│   ├── fonts                       # Fonts
│   ├── icomoon                     # Icomoon project files
│   ├── images                      # Images
│   ├── js                          # JavaScript files
│   ├── styles                      # SASS / SCSS files
│   ├── partials                    # Included HTML files
│   ├── swipers                     # JSON files with Swiper params
│   ├── templates                   # Templates (Handlebars, Mustache etc)
│   ├── vectors                     # SVG files for embedding in CSS
│   └── index.html                  # Index page
├── .browserslistrc                 # Supported browsers list
├── .editorconfig                   # IDE settings
├── .env                            # Environment settings
├── .eslintrc                       # ESLint configuration file
├── .gitignore                      # Git ignored files
├── .stylelintignore                # Stylelint inglored files
├── .stylelintrc                    # Stylelint configuration file
├── CHANGELOG.md                    # Release notes
├── config.js                       # User params
├── gulpfile.js                     # Main file for Gulp
├── package-lock.json               # Dependencies tree
├── package.json                    # Project info
├── README-ru.md                    # Documentation in Russian
└── README.md                       # Documentation
```

<a name="config-files"></a>

### Config files

Each time the build is run, params are imported from following files:

- Global params `/gulp/config`
- User params `/config.js`

**Parameter priority (in ascending order):**

- Global params
- User params
- Presets (params from presets fields in configuration files)
- cli params

<a name="params"></a>

## Common params

| Параметр   | Тип     | По умолчанию | Описание                                                          |
|------------|---------|--------------|-------------------------------------------------------------------|
 | minify     | object  | false        | Minify files                                                      |
 | sourcemaps | object  | false        | Generate sourcemaps for CSS and JS files                          |
 | babel      | boolean | false        | Transpile JS to ES5 with Babel                                    |
 | rollup     | boolean | false        | Building JS with Rollup                                           |
 | webp       | boolean | false        | Convert all images to WebP format                                 |
 | abstract   | boolean | false        | Generate abstract page with project files list                    |
 | debug      | boolean | false        | Enable debug mode                                                 |
 | force      | array   | []           | Task names for force upload                                       |
 | preset     | string  | 'global'     | Name of applying preset                                           |
 | open       | string  | 'index'      | Startup page (without .html extension)                            |
 | host       | string  | 'default'    | FTP host key from `config.ftp` file                               |
 | mode       | string  | 'dev'        | Building mode (dev/build), available globally in HTML as `@@mode` |

<a name="command-line"></a>

### Run with cli params

All of the above params can be passed to command line through appropriate flags.

Example running with cli params:

```shell
gulp --babel --minify js --open catalog
```

The described command is equivalent to the following entry in configuration file:

```javascript
{
    babel: true,
    minify: {
        css: false, // inherited from global params
        js: true
    },
    open: 'catalog'
}
```

<a name="presets"></a>

### Presets

Presets allow you to start building with predefined params depending on task name or create your own combinations of params.

To create a new preset, add params to `presets` field in `/config.js` file.

Params from preset will be applied if:

- Preset name is equivalent to current task name (`build` - for build task, `deploy` - for deploy task, etc);
- Preset name passed as cli param `--preset`.

**Preset example**

```
config.presets = {
    deploy: {
        babel: true,
        compress: true,
        mode: 'build'
    }
}
```

This preset is equivalent to launching with following params:

```shell
gulp deploy --babel --compress --mode build
```

**Custom preset example**

```
config.presets = {
    myPreset: {
        debug: true,
        minify: {
            css: true,
            js: true
        }
    }
}
```

The above params will be applied when `--preset` flag is explicitly specified:

```shell
gulp --preset myPreset
```

#### Global preset

Params from global preset are always applied and can only be overridden from command line.

```javascript
config.presets = {
    global: {
        abstract: true,
        open: 'home'
    }
}
```

<a name="process"></a>

## Working with files

<a name="html"></a>

### HTML files

HTML files are placed in `/src` directory.

Included files are placed in `/src/partials/` directory.

For convenient work with HTML files, you can use [gulp-file-include](https://www.npmjs.com/package/gulp-file-include) operators:

- `@@include`
- `@@if`
- `@@for`
- `@@loop`

Documentation and usage examples can be found [here](https://github.com/haoxins/gulp-file-include#readme).

<a name="sass"></a>

### SASS / SCSS files

SASS / SCSS files are placed in `/src/styles` directory.

<a name="js"></a>

### JS files

JS files are placed in `/src/js` directory.

:warning: **Files merging**
>By default, all SASS and JS files are combined into one output file.
If you need to create a separate file, append `.module` postfix to file name (e.g. `component.module.scss`).
Thereafter `component.css` file will be created and added to all project pages.

<a name="images"></a>

### Images

Images are placed in `/src/images` directory.

Compression settings are set in `config.plugins.image` param.

To convert all images to WebP format, set `config.webp` param to `true`.

<a name="svg-base64"></a>

### Convert SVG to Base64

To convert SVG files to Base64 and subsequent embedding to CSS, move them to the `/src/vectors` directory.

<a name="icomoon"></a>

### Icomoon icons

To add icons, move Icomoon project files from [icomoon.io](https://icomoon.io/app/) website to `/src/icomoon` directory.

The icons will be available in SASS via `$icomoon-icons` map.

<a name="templates"></a>

### Templates (Handlebars, Mustache)

If you are using HTML compilers like Handlebars or Mustache, you can store template files in `/src/templates` directory.

<a name="deploy"></a>

## Deploy

Before deploying files to server, you must set FTP params in `.env` file.

After that, run the command:

```shell
gulp deploy
```

<a name="add-ftp-host"></a>

### Adding FTP host

By default, files are uploaded to `default` host.

If you need to create another FTP host, add params to `.env` file:

```
FTP_CUSTOM_HOST=HOSTNAME
FTP_CUSTOM_USER=USER
FTP_CUSTOM_PASSWORD=PASSWORD
FTP_CUSTOM_DEST=DEST
FTP_CUSTOM_URI=URL
```

After that, import environment params in `config.js` file and use host name as object key:

```
config: {
    ftp: {
        custom: {
            host: process.env.FTP_CUSTOM_HOST,
            user: process.env.FTP_CUSTOM_USER,
            password: process.env.FTP_CUSTOM_PASSWORD,
            dest: process.env.FTP_CUSTOM_DEST,
            uri: process.env.FTP_CUSTOM_URI
        }
    }
}
```

To upload files to the `custom` host, run command:

```shell
gulp deploy --host custom
```

<a name="force-upload"></a>

### Force upload

Before building, you can pass a list of required tasks through the `--force` flag. Then only selected tasks will be launched, and all others will be ignored.

This can be useful if you want to build and deploy recently modified files only.

```shell
gulp deploy --force html,css,js
```

<a name="production-mode"></a>

### Production mode

In production mode transpiling to ES5 and minification of files are enabled by default, so passing `--minify` and `--babel` flags is not required.

If you want to change this behavior, edit `config.presets.deploy` preset.

<a name="zip"></a>

## Creating ZIP files

To create ZIP files with source and compiled files, run the task:

```shell
gulp zip
```

File names for ZIP files are specified in `config.files.zip` param.

<a name="reports"></a>

## Audit with PageSpeed Insights

>[Google Lighthouse](https://github.com/GoogleChrome/lighthouse) is an open source auditing tool that helps developers improve performance and accessibility of their web projects.

PageSpeed Insights reports are generated on the local server for each project page after running the command:

```shell
gulp reports
```

Depending on number of pages and hardware resources, this task may take a long time to complete.

## LICENSE

[The MIT License (MIT)](LICENSE)
