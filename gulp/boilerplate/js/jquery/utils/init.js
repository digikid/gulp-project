import $ from 'jquery';

export default function(selector, context, root) {
    return (typeof selector === 'string') ? new $.fn._init(selector, context, root).data('selector', selector) : new $.fn._init(selector, context, root);
};