import $ from 'jquery';

import './polyfills';

import App from './classes/App';

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

const app = new App();

app.use(Preload, '[data-preload]');
/* if:fancybox */
app.use(Fancybox, '[data-fancybox]');
/* /if:fancybox */
/* if:lozad */
app.use(LazyLoad, '[data-src], [data-background-image]');
/* /if:lozad */
/* if:simplebar */
app.use(Scrollbar, '[data-scrollbar]');
/* /if:simplebar */
/* if:swiper */
app.use(Swiper, '[data-swiper]', {
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
app.use(Tooltip, '[data-tooltip]');
/* /if:tippy */
/* if:mask */
app.use(Phone, '[data-phone]');
/* /if:mask */
/* if:datepicker */
app.use(Datepicker, '[data-datepicker]');
/* /if:datepicker */
app.use(Select, '[data-select]');

app.init(() => {
    // app is ready ...
});