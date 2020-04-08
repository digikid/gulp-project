// helpers
;(function($) {
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

    // fancybox localization
    $.fancybox.defaults.i18n.ru = {
        CLOSE: 'Закрыть',
        NEXT: 'Вперед',
        PREV: 'Назад',
        ERROR: 'Произошла ошибка при загрузке контента. Пожалуйста, попробуйте позже.',
        PLAY_START: 'Слайдшоу',
        PLAY_STOP: 'Стоп',
        FULL_SCREEN: 'На весь экран',
        THUMBS: 'Превью',
        DOWNLOAD: 'Скачать',
        SHARE: 'Поделиться',
        ZOOM: 'Приблизить'
    };
    $.fancybox.defaults.lang = 'ru';

    // modal
    $('.js-modal').fancybox({
        autoFocus: false
    });

    $(document).on('click', '.js-close', function(e) {
        e.preventDefault();
        $.fancybox.close();
    });

    // tooltips
    $('[data-tooltip]').each(function() {
        var text = $(this).attr('data-tooltip') || $(this).attr('aria-label');
        new tippy(this, {
            content: text,
            theme: 'white'
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