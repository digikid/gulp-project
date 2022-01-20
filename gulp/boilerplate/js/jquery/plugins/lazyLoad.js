import $ from 'jquery';
import lozad from 'lozad';

const defaults = {
    rootMargin: '60px 0px',
    cssClasses: {
        loading: 'is-loading',
        loaded: 'is-loaded',
        appeared: 'is-appeared',
        error: 'is-error'
    }
};

export default function(options = {}) {
    const settings = $.extend(true, {}, defaults, options);

    return this.each(function() {
        const _this = this;
        const $this = $(this);

        const src = $this.attr('data-src') || $this.attr('data-background-image');

        const {
            rootMargin,
            cssClasses: {
                loading,
                loaded,
                appeared,
                error
            }
        } = settings;

        if (src && !$this.is('video')) {
            $this.addClass(loading);
        };

        _this.onLoad = () => {
            $this.removeClass(loading).addClass(loaded);
        }

        _this.onError = () => {
            $this.removeClass(loading).addClass(error);
        };

        _this.init = () => {
            _this.observer = lozad(_this, {
                rootMargin,
                loaded: el => {
                    $this.addClass(appeared);

                    if (src) {
                        try {
                            $('<img/>').on('load', _this.onLoad).on('error', _this.onError).attr('src', src);
                        } catch(e) {
                            console.log(e);
                        };
                    };

                    if ($this.is('video')) {
                        $this.addClass(loaded);
                    };
                }
            });

            _this.observer.observe();
        };

        _this.init();
    });
};