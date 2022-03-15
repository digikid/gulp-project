import $ from 'jquery';

export const preventEvent = e => {
    e = e || window.event;

    if (e.preventEvent) {
        e.preventEvent();
    };

    e.returnValue = false;
};

export const preventKeyEvent = (e, keys = []) => {
    if (keys.includes(e.keyCode)) {
        preventEvent(e);

        return false;
    };
};

export const triggerNative = function(e) {
    return this.each(function() {
        if (!e) return;

        this.dispatchEvent(new Event(e, {
            bubbles: true
        }));
    });
};

$.fn.triggerNative = triggerNative;