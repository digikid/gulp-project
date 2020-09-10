// mode
window._MODE = (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.port === '9002') ? 'local' : (document.location.host === 'demo.relevant.ru') ? 'demo' : 'build';

// path to files
window._TEMPLATES_PATH = document.location.origin + '/templates/';
window._MARKERS_PATH = document.location.origin + '/images/';

if (window._MODE === 'demo') {
    window._TEMPLATES_PATH = '/zabota/templates/';
    window._MARKERS_PATH = '/zabota/images/';
};

if (window._MODE === 'build') {
    window._TEMPLATES_PATH = '/local/templates/zabota/build/templates/';
    window._MARKERS_PATH = '/local/templates/zabota/build/images/';
};

// helpers
;(function($) {
    @@include('language/fancybox.js')
    $.fancybox.defaults.autoFocus = false;
    $.fancybox.defaults.backFocus = false;
    $.fancybox.defaults.touch = false;

    @@include('partials/debounce.js')
    @@include('partials/preloader.js')
    @@include('partials/form.js')
    @@include('partials/lazyLoad.js')
    @@include('partials/swiper.js')
}(jQuery));

// when document ready
$(document).ready(function() {

    // detect browser
    var detect = $.fn.deviceDetector.getInfo();

    // DOM manipulations


    // wrap table
    $('.wysiwyg table').wrap('<div class="table-wrapper"><div class="table-inner"></div></div>');

    // forms
    $.fn.initFormListeners();

    // lazy loading
    $('.js-lazy').initLazyLoading();

    // swiper
    $('.js-swiper').initSwiper();

    // fancybox
    $('a[href^="#modal"], .js-modal').fancybox();

    $(document).on('click', '.js-close', function(e) {
        e.preventDefault();
        $.fancybox.close();
    });

    // tooltips
    $('[data-tooltip]').each(function() {
        var text = $(this).attr('data-tooltip') || $(this).attr('aria-label');
        new tippy(this, {
            content: text,
            theme: 'light'
        });
    });

    // scrollbar
    $('[data-scrollable]').each(function(i, item) {
        new SimpleBar(item, {
            timeout: 500
        });
    });

    $(window).on({
        resize: function() {

        },
        scroll: function() {

        }
    }).trigger('resize');

    // page preloader
    $('body').preloader();
});