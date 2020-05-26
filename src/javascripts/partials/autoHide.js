$.fn.autoHide = function(options) {

    var settings = $.extend(true, {}, {
        collapse: 0,
        offset: 15,
        debounce: 300,
        duration: 600,
        disable: null,
        watch: []
    }, options);

    return this.each(function() {
        var _this = this,
            $this = $(this);

        _this.scrollDirection = 'none';
        _this.lastScrollTop = window.scrollY || 0;
        _this.isHidden = false;
        _this.point = 0;
        _this.watch = [];

        _this.initWatch = function() {
            if (!Array.isArray(settings.watch)) return;

            $.each(settings.watch, function(i, el) {
                if ($(el).length) {
                    _this.watch.push($(el).offset().top);
                };
            });
        };

        _this.collapse = function() {
            var top = $(window).scrollTop(),
                height = $this.outerHeight(),
                negativeTop = (height + settings.offset) * -1,
                collapsePoint = (typeof settings.collapse === 'function') ? settings.collapse() : settings.collapse,
                watchPointMin = settings.collapse,
                watchPointMax = $(document).height();

            if (_this.watch.length) {
                watchPointMin = Math.min.apply(null, _this.watch) - $this.outerHeight();
                watchPointMax = Math.min.apply(null, _this.watch);
            };

            if (_this.scrollDirection === 'down' || _this.scrollDirection === 'none') {
                if (top > collapsePoint || top > watchPointMin) {
                    $this.css('top', negativeTop);
                    _this.isHidden = true;
                };
            };

            if (_this.scrollDirection === 'up') {
                if (_this.isHidden && top < watchPointMax) {
                    if (typeof settings.disable === 'function' && settings.disable()) {
                        return;
                    };

                    $this.css('top', 0);
                    _this.isHidden = false;
                };
            };

            if ($this.attr('style') && $this.attr('style').indexOf('visibility') !== -1) {
                $this.attr('style', function(i, style) {
                    return style && style.replace(/visibility[^;]+;?/g, '');
                });
            };
        };

        _this.scrollListeners = function(e) {
            var top = $(window).scrollTop();
            _this.scrollDirection = (top > _this.lastScrollTop) ? 'down' : (top !== _this.lastScrollTop) ? 'up' : 'none';
            _this.lastScrollTop = top;
            $.fn.debounce(_this.collapse, settings.debounce || 0)();
        };

        _this.init = function() {
            if ($(window).scrollTop()) {
                $this.css('visibility', 'hidden').addClass('is-autohide');
            };

            setTimeout(function() {
                $this.css('transition', $this.css('transition') + ', top ' + settings.duration / 1000 + 's ease-in-out 0s');
            }, settings.duration);

            _this.initWatch();

            $(window).on('scroll', _this.scrollListeners).trigger('scroll');
        };

        _this.init();
    });
};
