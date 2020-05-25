$.fn.initSwiper = function(options) {

    var settings = $.extend(true, {}, {
        slidesPerView: 1,
        spaceBetween: 18,
        watchOverflow: true,
        breakpoints: {
            768: {
                slidesPerView: 2
            },
            1200: {
                slidesPerView: 3
            }
        },
        onReady: null
    }, options);

    if (!window.swipers) {
        window.swipers = {};

        var total = $(this).length;

        $(document).on('swiperReady', function() {
            if (Object.keys(window.swipers).length === total) {
                window.allSwipersIsReady = true;
                $.each(window.swipers, function(i, item) {
                    window.allSwipersIsReady = window.allSwipersIsReady && item.swiper.initialized;
                });
                $(document).trigger('readyChecker');
            };
        });
    };

    return this.each(function() {
        var _this = this,
            $this = $(this),
            id = $(this).attr('data-swiper-id') || $(this).attr('id');

        if (window.swipers[id] !== undefined) {
            return;
        };

        _this.swiperInstance = null;
        _this.routes = [];

        _this.createRoutes = function() {
            $this.children().each(function(i, item) {
                var id = $(item).attr('data-id') || $(item).attr('data-object-id');
                if (id) {
                    _this.routes.push({
                        id: id,
                        index: i
                    });
                };
            });
        };

        _this.getIndexById = function(id) {
            var route = _this.routes.filter(function(slide) {
                return slide.id.toString() === id.toString();
            });
            return route.length ? route[0].index : 0;
        };

        _this.slideToId = function(id) {
            if (_this.swiperInstance) {
                var slideIndex = _this.getIndexById(id);
                _this.swiperInstance.slideToLoop(slideIndex);
            };
        };

        _this.buildLayout = function() {
            $this.children().wrap('<div class="swiper-slide"></div>');
            $this.wrapInner('<div class="swiper-container"><div class="swiper-wrapper"></div></div>');
            $this.find('.swiper-wrapper').after('<div class="swiper-pagination"></div>');
            $this.append('<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>');

            _this.afterLayoutOptions = {
                pagination: {
                    el: $this.find('.swiper-pagination'),
                    clickable: true
                },
                navigation: {
                    nextEl: $this.find('.swiper-button-next'),
                    prevEl: $this.find('.swiper-button-prev'),
                    clickable: true
                },
                on: {
                    init: function() {
                        if (settings.on !== undefined && settings.on.init !== undefined && typeof settings.on.init === 'function') {
                            settings.on.init(this);
                        };

                        $(this.$el).find('.js-lazy').initLazyLoading();
                        $this.addClass('is-ready');

                        $(document).trigger('swiperReady');
                    }
                }
            };
        };

        _this.destroy = function(id) {
            if (window.swipers[id] !== undefined) {
                window.swipers[id].swiper.destroy(true, true);
                window.swipers[id] = undefined;
                _this.swiperInstance = null;
            };
        };

        _this.init = function() {
            _this.createRoutes();
            _this.buildLayout();

            _this.dataOptions = $this.attr('data-swiper-options') ? JSON.parse($this.attr('data-swiper-options')) : {};
            _this.params = $.extend(true, {}, settings, _this.afterLayoutOptions, _this.dataOptions);

            _this.swiperInstance = new Swiper($this.find('.swiper-container'), _this.params);

            window.swipers[id] = {
                id: id,
                swiper: _this.swiperInstance,
                routes: _this.routes,
                getIndexById: _this.getIndexById,
                slideToId: _this.slideToId
            };

            if (typeof _this.params.onReady === 'function') {
                _this.params.onReady(window.swipers[id]);
            };

            $(document).trigger('swiperReady');
        };

        _this.init();
    });
};
