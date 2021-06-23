require('core-js');
require('regenerator-runtime/runtime');

const $ = require('jquery');

window.jQuery = window.$ = $;

require('js.device.detector/dist/jquery.device.detector.js');
require('intersection-observer');
require('@fancyapps/fancybox');
require('jquery-mask-plugin');
require('@popperjs/core/dist/umd/popper.min.js');
require('air-datepicker');

const Swiper = require('swiper/swiper-bundle');
const SimpleBar = require('simplebar');
const lozad = require('lozad');
const tippy = require('tippy.js/dist/tippy.umd.min.js');