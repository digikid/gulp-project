import $ from 'jquery';

export default function(e) {
    return this.each(function() {
        if (!e) return;

        this.dispatchEvent(new Event(e, {
            bubbles: true
        }));
    });
};