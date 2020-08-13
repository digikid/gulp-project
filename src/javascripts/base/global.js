// helpers
;(function($) {
    @@include('language/fancybox.js')
    $.fancybox.defaults.autoFocus = false;
    $.fancybox.defaults.backFocus = false;
    $.fancybox.defaults.touch = false;

    @@include('partials/debounce.js')
    @@include('partials/preloader.js')
    @@include('partials/breakpoints.js')
    @@include('partials/form.js')
    @@include('partials/lazyLoad.js')
    @@include('partials/scroller.js')
    @@include('partials/swiper.js')
    @@include('partials/topper.js')
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

    // scroller
    $('.js-scroll').scroller();

    // topper
    $('.topper').topper();

    // fancybox
    $('a[href^="#modal"]').fancybox();

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