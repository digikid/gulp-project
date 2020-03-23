$.fn.topper = function(options) {

    var settings = $.extend(true, {}, {
        breakpoint: 0,
        duration: 800
    }, options);

    return this.each(function() {
        var _this = this,
            $this = $(this);

        _this.clickListeners = function() {
            $('body, html').animate({
                scrollTop: 0
            }, settings.duration, 'swing');
        };

        _this.scrollListeners = function() {
            if ($(this).scrollTop() != settings.breakpoint) {
                $this.fadeIn();
            } else {
                $this.fadeOut();
            };
        };

        _this.init = function() {
            $this.click(_this.clickListeners);
            $(window).scroll(_this.scrollListeners);
        };

        _this.init();
    });
};
