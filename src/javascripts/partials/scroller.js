$.fn.scroller = function(options) {

    // default options
    var settings = $.extend(true, {}, {
        offset: 0,
        duration: 1200,
        delay: 0,
        onStart: function() {},
        onScroll: function() {},
        onComplete: function() {}
    }, options);

    return this.each(function() {
        var _this = this,
            $this = $(this),
            anchor = $(this).attr('href') !== '#' ? $(this).attr('href') : $(this).attr('data-href'),
            $el = $(anchor);

        $this.click(function(e) {
            e.preventDefault();

            $.each(settings, function(key, value) {
                var mutableOptions = ['offset', 'duration', 'delay'];
                if (mutableOptions.indexOf(key) !== -1) {
                    _this[key] = typeof value == 'function' ? value($this, $el) : value;
                };
            });

            if ($el.length) {
                setTimeout(function() {
                    $('html, body').animate({ scrollTop: ($el.offset().top - _this.offset) }, {
                        duration: _this.duration,
                        easing: 'swing',
                        start: function(now) {
                            settings.onStart($this, $el);
                        },
                        step: function(now) {
                            settings.onScroll($this, $el, now);
                        },
                        complete: function(now) {
                            settings.onComplete($this, $el);
                        }
                    });
                }, _this.delay);
            };
        });
    });
};
