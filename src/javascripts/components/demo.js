$(document).ready(function() {

    // run only in demo mode
    if (window._MODE !== 'build') {

        // disable form submit
        $('form').on('submit', function(e) {
            e.preventDefault();

            if (!$(this).hasClass('form--booking')) {
                $.fancybox.close();
                $.fancybox.open($('#modal-success'));
            };
        });

        // copy button class
        $('.page--ui .btn').each(function() {
            if ($(this).closest('.section--buttons').length) {
                try {
                    new ClipboardJS($(this)[0], {
                        text: function(trigger) {
                            return $(trigger).attr('class');
                        }
                    });
                } catch(e) {};
            };
        }).click(function(e) {
            e.preventDefault();
        });

        // active menu
        $('.menu__item').each(function() {
            var path = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

            if ($(this).find('a').attr('href') === path && !$(this).siblings('.is-active').length) {
                $(this).addClass('is-active');
            };
        });
    };
});