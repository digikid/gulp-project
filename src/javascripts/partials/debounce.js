$.fn.debounce = function(func, timeout) {
    if (!func) return;
    var timeoutID, timeout = timeout || 200;
    return function() {
        var scope = this, args = arguments;
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function() {
            func.apply(scope, Array.prototype.slice.call(args));
        }, timeout);
    };
};
