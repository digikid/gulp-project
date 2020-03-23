$.fn.extend({
    breakpoints: function() {
        var _this = this;

        var methods = {
            init: function() {
                if (_this.checks === undefined) {
                    _this.checks = {};
                };

                return this;
            },
            add: function(breakpoint, smaller, larger) {
                var _breakpoint = breakpoint.toString();

                if (!(_breakpoint in _this.checks)) {
                    _this.checks[_breakpoint] = {};
                    _this.checks[_breakpoint].check = null;
                    _this.checks[_breakpoint].smaller = typeof smaller === 'function' ? [smaller] : [];
                    _this.checks[_breakpoint].larger = typeof larger === 'function' ? [larger] : [];
                } else {
                    if (typeof smaller === 'function') {
                        _this.checks[_breakpoint].smaller.push(smaller);
                    };
                    if (typeof larger === 'function') {
                        _this.checks[_breakpoint].larger.push(larger);
                    };
                };

                methods.resize();

                return this;
            },
            resize: function() {
                $(window).resize(function() {
                    $.each(_this.checks, function(_breakpoint, _check) {
                        var check = window.matchMedia('(min-width: ' + _breakpoint + 'px)').matches;

                        if (_this.checks[_breakpoint].check !== check) {
                            _this.checks[_breakpoint].check = check;

                            if (!check) {
                                $.each(_this.checks[_breakpoint].smaller, function(i, fn) {
                                    fn();
                                });
                            } else {
                                $.each(_this.checks[_breakpoint].larger, function(i, fn) {
                                    fn();
                                });
                            };
                        };
                    });
                }).trigger('resize');
            }
        };

        methods.init();

        return methods;
    }
});
