import $ from 'jquery';
import AirDatepicker from 'air-datepicker';

import {
    disable as disableScroll,
    enable as enableScroll
} from '../../../utils/scroll';

const defaults = {
    autoClose: true,
    minDate: new Date(),
    onShow: isFinished => {
        if (isFinished) {
            disableScroll();
        };
    },
    onHide: isFinished => {
        if (isFinished) {
            enableScroll();
        };
    }
};

export default function(options = {}) {
    const settings = $.extend(true, {}, defaults, options);
    const selector = $(this).data('selector');

    return this.each(function() {
        const _this = this;
        const $this = $(this);

        _this.init = function() {
            new AirDatepicker(selector, settings);
        };

        _this.init();
    });
};