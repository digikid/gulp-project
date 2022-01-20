import $ from 'jquery';
import SimpleBar from 'simplebar';

const defaults = {
    timeout: 500
};

export default function(options = {}) {
    const settings = $.extend(true, {}, defaults, options);

    return this.each(function() {
        new SimpleBar(this, settings);
    });
};