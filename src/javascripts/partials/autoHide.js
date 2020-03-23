$.fn.autoHide = function(options) {

    var settings = $.extend(true, {}, {
        breakpoint: 767,
        collapse: 0,
        debounce: 300,
        watch: []
    }, options);

    return this.each(function() {
        var _this = this,
            $this = $(this);

        _this.scrollDirection = 'none';
        _this.lastScrollTop = window.scrollY || 0;
        _this.isHidden = false;
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
                negativeTop = -(height + 15),
                collapsePoint = window.matchMedia('(max-width: ' + settings.breakpoint + 'px)').matches ? $(window).height() / 2 : settings.collapse,
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
                    $this.css('top', 0);
                    _this.isHidden = false;
                };
            };
        };

        _this.scrollListeners = function(e) {
            var top = $(window).scrollTop();
            _this.scrollDirection = (top > _this.lastScrollTop) ? 'down' : (top !== _this.lastScrollTop) ? 'up' : 'none';
            _this.lastScrollTop = top;
            $.fn.debounce(_this.collapse, settings.debounce || 0)();
        };

        _this.init = function() {
            $this.addClass('is-autohide').css('position', 'sticky');
            _this.initWatch();
            $(window).on('scroll', _this.scrollListeners).trigger('scroll');
        };

        _this.init();
    });
};
