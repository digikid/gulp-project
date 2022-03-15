import $ from 'jquery';

import './polyfills';

import Preload from './components/preload';

/* if:fancybox */
import Fancybox from './components/fancybox';
/* /if:fancybox */

/* if:lozad */
import LazyLoad from './components/lazyLoad';
/* /if:lozad */

/* if:simplebar */
import Scrollbar from './components/scrollbar';
/* /if:simplebar */

/* if:swiper */
import Swiper from './components/swiper';
/* /if:swiper */

/* if:tippy */
import Tooltip from './components/tooltip';
/* /if:tippy */

/* if:mask */
import Phone from './components/phone';
/* /if:mask */

/* if:datepicker */
import Datepicker from './components/datepicker';
/* /if:datepicker */

import Select from './components/select';

window.$ = window.jQuery = $;

$(function() {
    const preload = new Preload('[data-preload]');

    /* if:fancybox */
    const fancybox = new Fancybox('[data-fancybox]');
    /* /if:fancybox */

    /* if:lozad */
    const lazyLoad = new LazyLoad('[data-src], [data-background-image]');
    /* /if:lozad */

    /* if:simplebar */
    const scrollbar = new Scrollbar('[data-scrollbar]');
    /* /if:simplebar */

    /* if:swiper */
    const swiper = new Swiper('[data-swiper]', {
        slidesPerView: 1,
        spaceBetween: 20,
        breakpoints: {
            992: {
                slidesPerView: 2
            },
            1200: {
                slidesPerView: 3
            }
        }
    });
    /* /if:swiper */

    /* if:tippy */
    const tooltip = new Tooltip('[data-tooltip]');
    /* /if:tippy */

    /* if:mask */
    const phone = new Phone('[data-phone]');
    /* /if:mask */

    /* if:datepicker */
    const datepicker = new Datepicker('[data-datepicker]');
    /* /if:datepicker */

    const select = new Select('[data-select]');
});