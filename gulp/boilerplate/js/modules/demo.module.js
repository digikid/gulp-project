import { mode } from '../config';

$(document).ready(() => {
    if (mode === 'build') return;

    $('form').on('submit', function(e) {
        e.preventDefault();

        $.fn.modal('success');
    });

    $('.menu__item').each(function() {
        const { href } = location;

        const index = href.lastIndexOf('/') + 1;
        const path = href.substring(index);

        if ($(this).find('a').attr('href') === path && !$(this).siblings('.is-active').length) {
            $(this).addClass('is-active');
        };
    });
});