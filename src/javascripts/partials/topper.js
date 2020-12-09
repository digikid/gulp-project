$.fn.topper = function(options) {

    var settings = $.extend(true, {}, {
        breakpoint: 0,
        duration: 800,
        throttle: 300,
        direction: null,
        onShow: null,
        onHide: null
    }, options);

    return this.each(function() {
        var _this = this,
            $this = $(this);

        _this.direction = null;
        _this.top = 0;
        _this.lastScrollTop = 0;

        _this.show = function() {
            if (typeof settings.onShow === 'function') {
                settings.onShow($this, _this.direction, _this.top);
            } else {
                $this.fadeIn();
            };
        };

        _this.hide = function() {
            if (typeof settings.onShow === 'function') {
                settings.onHide($this, _this.direction, _this.top);
            } else {
                $this.fadeOut();
            };
        };

        _this.clickListeners = function() {
            $('body, html').animate({
                scrollTop: 0
            }, settings.duration, 'swing');
        };

        _this.scrollListeners = function() {
            if (_this.top > _this.breakpoint) {
                if (settings.direction && settings.direction !== _this.direction) {
                    _this.hide();
                } else {
                    _this.show();
                };
            } else {
                _this.hide();
            };
        };

        _this.init = function() {
            $this.click(_this.clickListeners).hide();

            setTimeout(function() {
                $(window).scroll($.fn.throttle(function() {
                    _this.top = $(this).scrollTop();
                    _this.breakpoint = typeof settings.breakpoint === 'function' ? settings.breakpoint() : settings.breakpoint;
                    _this.direction = _this.top > _this.lastScrollTop ? 'down' : _this.top < _this.lastScrollTop ? 'up' : null;

                    _this.scrollListeners();

                    _this.lastScrollTop = _this.top <= 0 ? 0 : _this.top;
                }, settings.throttle));
            }, settings.throttle);
        };

        _this.init();
    });
};
