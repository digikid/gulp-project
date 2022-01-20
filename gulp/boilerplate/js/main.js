import './polyfills';

import ready from './jquery';

ready(() => {
    /* if:lozad */
    $('[data-src], [data-background-image]').lazyLoad();
    /* /if:lozad */

    /* if:simplebar */
    $('[data-scrollable]').simplebar();
    /* /if:simplebar */

    /* if:fancybox */
    $('[data-fancybox]').fancybox({
        closeSelector: '[data-close]'
    });
    /* /if:fancybox */

    /* if:swiper */
    $('[data-swiper]').swiper({
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
    $('[data-tooltip]').tooltip();
    /* /if:tippy */

    $('[data-form]').form();

    $('body').preloader();
});