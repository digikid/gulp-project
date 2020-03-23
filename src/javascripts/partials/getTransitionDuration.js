$.fn.getTransitionDuration = function(el, hasDelay) {
    var $el = $(el),
        prefixes = 'moz webkit ms o khtml'.split(' '),
        result = 0;

    for (var i = 0; i < prefixes.length; i++) {
        duration = $el.css('-' + prefixes[i] + '-transition-duration');

        if (duration) {
            var duration = (duration.indexOf('ms') >- 1) ? parseFloat(duration) : parseFloat(duration) * 1000;

            if (hasDelay) {
                var delay = $el.css('-' + prefixes[i] + '-transition-delay');
                duration += (delay.indexOf('ms') >- 1) ? parseFloat(delay) : parseFloat(delay) * 1000;
            };

            result = duration;
            break;
        };
    };

    return result;
};
