import $ from 'jquery';
import tippy from 'tippy.js';

const defaults = {
    theme: 'light'
};

export default function(options = {}) {
    const settings = $.extend(true, {}, defaults, options);

    return this.each(function() {
        const text = $(this).attr('data-tooltip') || $(this).attr('aria-label');

        if (text) {
            new tippy(this, {
                content: text,
                ...settings
            });
        };
    });
};