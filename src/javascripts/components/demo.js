$(document).ready(function() {

    // skip in build mode
    if (window._MODE !== 'build') {

        // disable form submit
        $('form').on('submit', function(e) {
            e.preventDefault();
            $.fn.showSuccessModal();
        });

        // set active menu item
        $('.menu__item').each(function() {
            var path = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

            if ($(this).find('a').attr('href') === path && !$(this).siblings('.is-active').length) {
                $(this).addClass('is-active');
            };
        });
    };
});