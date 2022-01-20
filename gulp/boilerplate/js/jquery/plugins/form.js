import $ from 'jquery';

const defaults = {};

export default function(options = {}) {
    const settings = $.extend(true, {}, defaults, options);
    const selector = $(this).data('selector');

    return this.each(function() {
        const _this = this;

        _this.init = () => {
            $(`${selector} select`).select();
            /* if:mask */
            $(`${selector} input[type="tel"]`).phone();
            /* /if:mask */
            /* if:datepicker */
            $(`${selector} [data-date]`).date();
            /* /if:datepicker */
        };

        _this.init();
    });
};