import jQuery from 'jquery';

import init from './utils/init';
import triggerNative from './utils/triggerNative';

/* if:lozad */
import lazyLoad from './plugins/lazyLoad';
/* /if:lozad */

/* if:fancybox */
import fancybox from './plugins/fancybox';
import modal from './plugins/modal';
/* /if:fancybox */

/* if:simplebar */
import simplebar from './plugins/simplebar';
/* /if:simplebar */

/* if:swiper */
import swiper from './plugins/swiper';
/* /if:swiper */

/* if:tippy */
import tooltip from './plugins/tooltip';
/* /if:tippy */

/* if:mask */
import phone from './plugins/form/phone';
/* /if:mask */

/* if:datepicker */
import date from './plugins/form/date';
/* /if:datepicker */

import select from './plugins/form/select';
import form from './plugins/form';
import preloader from './plugins/preloader';

window.$ = window.jQuery = jQuery;

const plugins = {
    init,
    triggerNative,
    /* if:lozad */
    lazyLoad,
    /* /if:lozad */
    /* if:fancybox */
    fancybox,
    modal,
    /* /if:fancybox */
    /* if:simplebar */
    simplebar,
    /* /if:simplebar */
    /* if:swiper */
    swiper,
    /* /if:swiper */
    /* if:tippy */
    tooltip,
    /* /if:tippy */
    /* if:mask */
    phone,
    /* /if:mask */
    /* if:datepicker */
    date,
    /* /if:datepicker */
    select,
    form,
    preloader
};

export default (ready, beforeReady) => {
    (function($, window, document, undefined) {
        $.settings = {};

        $.fn._init = $.fn.init;

        Object.entries(plugins).forEach(([key, func]) => {
            $.fn[key] = func;
        });

        if (typeof beforeReady === 'function') {
            beforeReady();
        };

        $(document).ready(ready);
    })(jQuery, window, document);
};