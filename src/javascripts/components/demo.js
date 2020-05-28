$(document).ready(function() {

    // disable form submit
    $('form').on('submit', function(e) {
        e.preventDefault();
        $.fancybox.close();
        $.fancybox.open($('#modal-success'));
    });

    // copy button class
    $('.page--ui .btn').click(function(e) {
        e.preventDefault();
    }).each(function() {
        if ($(this).closest('.section--buttons').length) {
            try {
                new ClipboardJS($(this)[0], {
                    text: function(trigger) {
                        return $(trigger).attr('class');
                    }
                });
            } catch(e) {};
        };
    });

    // active menu
    $('.menu__item').each(function() {
        var path = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);

        if ($(this).find('a').attr('href') === path) {
            $(this).addClass('is-active');
        };
    });

});