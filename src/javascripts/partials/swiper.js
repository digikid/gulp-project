$.fn.initSwiper = function(options) {

    var settings = $.extend(true, {}, {
        slidesPerView: 1,
        spaceBetween: 15,
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
        window.allSwipersIsReady = false;

        var total = $(this).length;

        $(document).on('swiperReady', function() {
            var swiperIds = Object.keys(window.swipers),
                isReady = true;

            if (swiperIds.length >= total) {
                swiperIds.forEach(function(item) {
                    isReady = isReady && window.swipers[item].swiper.initialized;
                });

                if (isReady && !window.allSwipersIsReady) {
                    window.allSwipersIsReady = true;
                    $(document).trigger('readyChecker');
                };
            };
        });
    };

    return this.each(function() {
        var _this = this,
            $this = $(this),
            id = $(this).attr('data-swiper-id') || $(this).attr('id'),
            thumbs = $(this).attr('data-swiper-thumbs');

        if (window.swipers[id] || !id) return;

        if (!window.swipers[thumbs]) {
            $('[data-swiper-id="' + thumbs + '"]').initSwiper(options);
        };

        _this.createRoutes = function() {
            _this.routes = [];

            $this.children().each(function(i, item) {
                _this.routes.push({
                    id: $(this).attr('data-slide-id') || $(this).index(),
                    index: i
                });
            });
        };

        _this.getIndexById = function(id) {
            var route = _this.routes.filter(function(route) {
                return route.id.toString() === id.toString();
            });
            return route.length ? route[0].index : 0;
        };

        _this.slideToId = function(id) {
            var slideIndex = _this.getIndexById(id);
            window.swipers[id].swiper.slideToLoop(slideIndex);
        };

        _this.buildLayout = function() {
            $this.children().wrap('<div class="swiper-slide"></div>');
            $this.wrapInner('<div class="swiper-container"><div class="swiper-wrapper"></div></div>');
            $this.find('.swiper-wrapper').after('<a class="swiper-control swiper-control--prev"></a><a class="swiper-control swiper-control--next"></a><div class="swiper-pagination"></div>');
            $this.append('<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>');
        };

        _this.destroy = function() {
            if (window.swipers[id] !== undefined) {
                window.swipers[id].swiper.destroy(true, true);
                window.swipers[id] = undefined;
            };
        };

        _this.init = function() {
            _this.createRoutes();
            _this.buildLayout();

            _this.$container = $this.find('.swiper-container');

            _this.afterLayoutOptions = {
                pagination: {
                    el: $this.find('.swiper-pagination'),
                    clickable: true
                },
                navigation: {
                    nextEl: $this.find('.swiper-control--next'),
                    prevEl: $this.find('.swiper-control--prev'),
                    clickable: true
                },
                on: {
                    init: function() {
                        if (settings.on && settings.on.init && typeof settings.on.init === 'function') {
                            settings.on.init(this);
                        };

                        $(this.$el).find('.js-lazy').initLazyLoading();
                        $this.addClass('is-ready');

                        $(document).trigger('swiperReady');
                    }
                }
            };

            _this.dataOptions = $this.attr('data-swiper-options') ? JSON.parse($this.attr('data-swiper-options')) : {};

            _this.params = $.extend(true, {}, settings, _this.afterLayoutOptions, _this.dataOptions);

            if (thumbs && window.swipers[thumbs]) {
                _this.params.thumbs = {
                    swiper: window.swipers[thumbs].swiper
                };
            };

            window.swipers[id] = {
                id: id,
                swiper: new Swiper(_this.$container, _this.params),
                routes: _this.routes,
                getIndexById: _this.getIndexById,
                slideToId: _this.slideToId,
                destroy: _this.destroy
            };

            if (typeof _this.params.onReady === 'function') {
                _this.params.onReady(window.swipers[id]);
            };

            $(document).trigger('swiperReady');
        };

        _this.init();
    });
};
