import $ from 'jquery';

const defaults = {
    cssClass: 'is-ready',
    limit: 0,
    onReady: null
};

export default function(options = {}) {
    const settings = $.extend(true, {}, defaults, options);

    return this.each(function() {
        const $this = $(this);

        const {
            cssClass,
            limit,
            onReady
        } = settings;

        if ($this.hasClass(cssClass)) {
            return;
        };

        $(document).on('allContentIsLoaded', function() {
            window.allContentIsLoaded = true;

            $(document).trigger('readyChecker');
        });

        $(document).on('readyChecker', function() {
            if (!window.swipers || $.isEmptyObject(window.swipers)) {
                window.allSwipersIsReady = true;
            };

            if (window.allContentIsLoaded && window.allSwipersIsReady) {
                if (typeof onReady === 'function') {
                    onReady();
                };

                $this.addClass(cssClass);
            };
        });

        if (document.readyState === 'complete') {
            $(document).trigger('allContentIsLoaded');
        } else {
            window.onload = function() {
                if (window.onloadTimeout) {
                    clearTimeout(window.onloadTimeout);
                };

                window.onloadTimeout = setTimeout(function() {
                    $(document).trigger('allContentIsLoaded');
                }, 0);
            };
        };

        if (limit) {
            window.preloadTimeout = setTimeout(function() {
                if (window.preloadTimeout) {
                    clearTimeout(window.preloadTimeout);
                };

                if (!$this.hasClass(cssClass)) {
                    $this.addClass(cssClass);
                };
            }, limit);
        };
    });
};