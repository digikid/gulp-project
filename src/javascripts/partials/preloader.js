$.fn.preloader = function(options) {

    var settings = $.extend(true, {}, {
        cssClass: 'is-ready',
        onReady: null
    }, options);

    return this.each(function() {
        var _this = this,
            $this = $(this);

        if ($this.hasClass(settings.cssClass)) {
            return;
        };

        _this.ready = function() {
            if (typeof settings.onReady === 'function') {
                settings.onReady();
            };
            $this.addClass(settings.cssClass);
        };

        _this.init = function() {
            if (document.readyState === 'complete') {
                _this.ready();
            } else {
                window.onload = function() {
                    setTimeout(function() {
                        _this.ready();
                    }, 0);
                };
            };
        };

        _this.init();
    });
};