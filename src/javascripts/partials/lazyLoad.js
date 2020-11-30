$.fn.initLazyLoading = function(options) {

    var settings = $.extend(true, {}, {
        rootMargin: '60px 0px',
        loadingClass: 'is-loading',
        loadedClass: 'is-loaded',
        appearedClass: 'is-appeared',
        errorClass: 'is-error'
    }, options);

    return this.each(function() {
        var _this = this,
            $this = $(this),
            src = $this.attr('data-src') || $this.attr('data-background-image');

        // add loading class if element is image
        if (src && !$this.is('video')) {
            $this.addClass(settings.loadingClass);
        };

        lozad(_this, {
            rootMargin: settings.rootMargin,
            loaded: function(el) {

                // if element appeared
                $this.addClass(settings.appearedClass);

                // check error status
                if (src) {
                    try {
                        $('<img/>').on('load', function() {
                            $this.removeClass(settings.loadingClass).addClass(settings.loadedClass);
                        }).on('error', function() {
                            $this.removeClass(settings.loadingClass).addClass(settings.errorClass);
                        }).attr('src', src);
                    } catch(e) {};
                };

                // if element is video
                if ($this.is('video')) {
                    $this.addClass(settings.loadedClass);
                };
            }
        }).observe();
    });
};
