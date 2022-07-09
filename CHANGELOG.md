# Release Notes

[1.7.6]: https://github.com/digikid/gulp-project/releases/tag/1.7.6

## [1.7.6] - 2022-07-09

### Features
- Handling multiple events in `initHandlers` method

### Updates

- All documentation translated into English

[1.7.5]: https://github.com/digikid/gulp-project/releases/tag/1.7.5

## [1.7.5] - 2022-04-19

### Features
- New methods for components `getOptions`, `getId`, `getElement`, `getElements`
- Event handlers are initialized via the `super.initHandlers` method
- Handlers for external controllers of `Swiper` component
- New method `toCamelCase`

### Bug Fixes
- Re-initialization of event handlers when components are creating
- Minor bug fixes, components code refactoring

### Updates
- Updated settings for ESLint / Stylelint
- Update dependencies list, fix vulnerabilities

[1.7.4]: https://github.com/digikid/gulp-project/releases/tag/1.7.4

## [1.7.4] - 2022-03-23

### Features
- `config.context` param to extend `fileInclude` context
- Support for the `multiple` attribute in `Select` component
- The `initHandlers` method is available for all components

### Bug Fixes
- Displaying checkboxes in the `Select` component
- Rollup build error when importing CommonJS modules

### Updates
- Update dependencies list, fix vulnerabilities

[1.7.3]: https://github.com/digikid/gulp-project/releases/tag/1.7.3

## [1.7.3] - 2022-03-16

### Features
- All components inherit from a common `Component`
- `Warning` component to display errors in components

### Bug Fixes
- Bugs in the `Select` component
- Errors in division operations in SASS files
- Minor bug fixes, code refactoring

### Updates
- All components rewritten using ES6 classes
- `Form` component is split into `Select`, `Phone` and `Datepicker` components
- `Date` and `Scrollable` components renamed to `Datepicker` and `Scrollbar`
- Updated helper functions for objects and arrays
- Update dependencies list, fix vulnerabilities

### Breaking Changes
- `Form` component
- Helper functions for jQuery components

[1.7.2]: https://github.com/digikid/gulp-project/releases/tag/1.7.2

## [1.7.2] - 2022-02-09

### Bug Fixes
- JS build error in production mode (Windows)
- Incorrect paths to module files on abstract page
- Disabled concatenation of hidden files
- Code refactoring, minor bug fixes

[1.7.1]: https://github.com/digikid/gulp-project/releases/tag/1.7.1

## [1.7.1] - 2022-02-05

### Features
- Creating ZIP files while `abstract` task is running (via `config.abstract.zip` param)

### Bug Fixes
- The contents of ZIP file with source files are no longer limited to `/src` directory
- Minor bug fixes

### Updates
- Support for ECMAScript modules is enabled by default
- Uses `sass` as default SASS compiler instead of node-sass
- `zip` task params moved to `config.zip`

### Breaking Changes
- Removed `es6` param
- Removed deprecated node-sass module

[1.7.0]: https://github.com/digikid/gulp-project/releases/tag/1.7.0

## [1.7.0] - 2022-01-28

### Features
- Support for ECMAScript modules via `es6` param
- Building JS files using Rollup via `rollup` param
- Compiling SASS and JS into separate files by adding a postfix
- Force building via `force` param
- Added versions of dependencies on abstract page
- Validation of all params before launching
- Updated documentation

### Bug Fixes
- Priority of cli params over other
- `index` task renamed to `abstract` and removed from required list
- ZIP files creation moved to separate task
- Reorganization of project structure and code refactoring

### Updates
- Updated plugins for image compression
- Deprecated plugin `js.device.detector` replaced with `bowser`
- Update dependencies list, fix vulnerabilities

### Breaking Changes
- Removed dependencies import from the /node_modules directory via the configuration file
- Removed task for compiling PUG files
- Removed `merge` and `main` params

[1.6.0]: https://github.com/digikid/gulp-project/releases/tag/1.6.0

## [1.6.0] - 2021-07-15

### Features
- Added core-js polyfills for better IE support
- Moved FTP params to separate .env file

### Bug Fixes
- Files combining when transpiling to ES5
- Bug fixes in Stylelint config file
- Code refactoring, minor bug fixes

### Updates
- Update `.browserslistrc`
- Update dependencies list, fix vulnerabilities

[1.5.0]: https://github.com/digikid/gulp-project/releases/tag/1.5.0

## [1.5.0] - 2020-12-01

### Features
- Transpile JS code to ES5 via Babel
- Compiling Pug files with support for importing data from JSON files
- Instant linting of SASS and JS files with Stylelint and ESLint
- New params `babel`, `preset`, `index`, `debug`, `open` and `mode`
- Presets for convenient combination of cli params
- Debug mode

### Bug Fixes
- Move user settings to separate config file
- Project structure optimization and code refactoring
- Code refactoring, minor bug fixes

### Updates
- Update dependencies list, fix vulnerabilities

### Breaking Changes
- Remove param for HTML files minification
- Replace `jpegtran` plugin with `mozjpeg` for better image compression

## 1.4.0 - 2020-08-24

### Features
- Concatenation and minification of CSS / JS files via `compress` param
- Localization files for Fancybox and Air Datepicker plugins
- Import information of user device, browser and OS to JS scope
- Clustering markers in Yandex.Maps

### Bug Fixes
- Updated polyfills list for IE
- Code refactoring, minor bug fixes

## 1.3.0 - 2020-06-01

### Features
- Import modules and libraries directly from configuration file

### Bug Fixes
- Code refactoring, minor bug fixes

## 1.2.0 - 2020-05-28

### Features
- `main` param to selectively upload files to server

### Bug Fixes
- Code refactoring, minor bug fixes

## 1.1.0 - 2020-04-23

### Features
- Audit pages through Google Lighthouse

### Bug Fixes
- Code refactoring, fix minor bugs

## 1.0.0 - 2020-03-20
Initial release
