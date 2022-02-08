import $ from 'jquery';
import Swiper, { Navigation, Pagination } from 'swiper';

import randomId from '../../utils/random/id';

const defaults = {
    onReady: null
};

export default function(options = {}) {
    const settings = $.extend(true, {}, defaults, options);

    if (!window.swipers) {
        window.swipers = {};
        window.allSwipersIsReady = false;

        const total = $(this).length;

        $(document).on('swiperReady', () => {
            const { swipers, allSwipersIsReady } = window;

            const swiperIds = Object.keys(swipers);

            if (swiperIds.length < total) return;

            let isReady = true;

            swiperIds.forEach(id => {
                const { swiper } = window.swipers[id];

                isReady = isReady && swiper;
            });

            if (isReady && !allSwipersIsReady) {
                window.allSwipersIsReady = true;

                $(document).trigger('checkReady');
            };
        });
    };

    return this.each(function() {
        const _this = this;
        const $this = $(this);

        const id = $(this).attr('data-swiper') || $(this).attr('id') || randomId();
        const thumbs = $(this).attr('data-thumbs');
        const dataOptions = $this.attr('data-options');
        const options = dataOptions ? JSON.parse(dataOptions) : {};

        if (!id || window.swipers[id]) return;

        if (thumbs && !window.swipers[thumbs]) {
            $(`[data-swiper="${thumbs}"]`).swiper(settings);
        };

        const params = $.extend(true, {}, settings, options, {
            on: {
                init: function() {
                    const { $el } = this;
                    const { on } = settings;

                    if (on && ('init' in on) && (typeof on.init === 'function')) {
                        on.init(this);
                    };

                    $(`[data-swiper="${id}"] [data-src], [data-swiper="${id}"] [data-background-image]`).lazyLoad();

                    $this.addClass('is-ready');

                    $(document).trigger('swiperReady');
                }
            }
        });

        _this.buildLayout = () => {
            $this.children().wrap('<div class="swiper-slide"></div>');
            $this.wrapInner('<div class="swiper"><div class="swiper-wrapper"></div></div>');
            $this.append('<div class="swiper-navigation"><div class="swiper-controls"><a class="swiper-control swiper-control--prev"></a><a class="swiper-control swiper-control--next"></a></div><div class="swiper-pagination"></div></div>');

            params.pagination = {
                el: $this.find('.swiper-pagination')[0],
                clickable: true
            };

            params.navigation = {
                nextEl: $this.find('.swiper-control--next')[0],
                prevEl: $this.find('.swiper-control--prev')[0],
                clickable: true
            };

            params.modules = [Navigation, Pagination];
        };

        _this.destroy = id => {
            if (window.swipers[id]) return;

            const { swiper } = window.swipers[id];

            swiper.destroy(true, true);

            delete window.swipers[id];
        };

        _this.init = () => {
            const { onReady } = params;

            _this.buildLayout();

            window.swipers[id] = {
                swiper: new Swiper($this.find('.swiper')[0], params)
            };

            if (typeof onReady === 'function') {
                onReady(window.swipers[id]);
            };

            $(document).trigger('swiperReady');
        };

        _this.init();
    });
};