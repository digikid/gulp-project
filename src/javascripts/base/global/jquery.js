@@include('language/fancybox.js')

$.fancybox.defaults.autoFocus = false;
$.fancybox.defaults.backFocus = false;
$.fancybox.defaults.touch = false;

if ($.fn.datepicker) {
    @@include('language/datepicker.js')
};

@@include('partials/debounce.js')
@@include('partials/throttle.js')
@@include('partials/preloader.js')
@@include('partials/form.js')
@@include('partials/lazyLoad.js')
@@include('partials/swiper.js')