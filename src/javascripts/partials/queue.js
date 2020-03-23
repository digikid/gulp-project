$.fn.queueAddClass = function(className) {
    this.queue('fx', function(next) {
        $(this).addClass(className);
        next();
    });
    return this;
};

$.fn.queueRemoveClass = function(className) {
    this.queue('fx', function(next) {
        $(this).removeClass(className);
        next();
    });
    return this;
};