$.fn.preloader = function(options) {

    var settings = $.extend(true, {}, {
        cssClass: 'is-ready',
        onReady: null
    }, options);

    var $this = $(this);

    if ($this.hasClass(settings.cssClass)) {
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
            if (typeof settings.onReady === 'function') {
                settings.onReady();
            };
            $this.addClass(settings.cssClass);
        };
    });

    if (document.readyState === 'complete') {
        $(document).trigger('allContentIsLoaded');
    } else {
        window.onload = function() {
            setTimeout(function() {
                $(document).trigger('allContentIsLoaded');
            }, 0);
        };
    };
};