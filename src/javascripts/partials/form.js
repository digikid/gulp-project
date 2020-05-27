// set cursor position
$.fn.setCursorPosition = function(pos) {
    this.each(function(index, elem) {
        if (elem.setSelectionRange) {
            elem.setSelectionRange(pos, pos);
        } else if (elem.createTextRange) {
            var range = elem.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    });
    return this;
};

// put cursor at end
$.fn.putCursorAtEnd = function() {
    return this.each(function() {
        var _this = this,
            $this = $(this);

        if (!$this.is(':focus')) {
            $this.focus();
        };

        if (_this.setSelectionRange) {
            var len = $this.val().length * 2;

            setTimeout(function() {
                _this.setSelectionRange(len, len);
            }, 1);
        } else {
            $this.val($this.val());
        };
        _this.scrollTop = 999999;
    });
};

// custom select
$.fn.customSelect = function(options) {

    var settings = $.extend(true, {}, {
        placeholder: 'hide',
        scrollbar: {
            timeout: 500
        }
    }, options);

    return this.each(function() {
        var _this = this;

        _this.$select = $(this);
        _this.$wrapper = $('<div class="select"></div>');
        _this.$input = $('<div class="select__input"></div>');
        _this.$options = $('<div class="select__options"></div>');
        _this.$item = $('<a href="#" class="select__item"></a>');
        _this.$dropdown = $('<div class="select__dropdown"></div>');

        _this.buildLayout = function() {
            _this.$select.addClass('select__element').wrap(_this.$wrapper);
            _this.$wrapper = _this.$select.parent();

            $.each(_this.$select.find('option'), function() {
                var $item = _this.$item.clone(),
                    isSelected = $(this).attr('selected'),
                    isPlaceholder = $(this).val() === settings.placeholder || $(this).attr('disabled');

                if (isPlaceholder || isSelected) {
                    _this.$input.html($(this).text());

                    if (isSelected) {
                        _this.$wrapper.addClass('is-checked');
                        $item.addClass('is-active');
                    } else return;
                };

                $item.html($(this).text()).attr('rel', $(this).val()).on('click', function(e) {
                    e.preventDefault();
                    var $option = $(this);
                    _this.$select.find('option').attr('selected', false).filter(function() {
                        return $(this).val() === $option.attr('rel');
                    }).attr('selected', true);
                    _this.$select.trigger('change');
                }).appendTo(_this.$options);
            });

            _this.$input.insertAfter(_this.$select);
            _this.$options.appendTo(_this.$dropdown);
            _this.$dropdown.insertAfter(_this.$input);
        };

        _this.initScrollbar = function() {
            _this.$simpleBar = new SimpleBar(_this.$dropdown[0], settings.scrollbar);
        };

        _this.clickListeners = function() {
            _this.$input.click(function(e) {
                e.stopPropagation();
                _this.$wrapper.toggleClass('is-opened');
                $('.select').not(_this.$wrapper).removeClass('is-focused is-opened');
            });

            $(document).on('click', function(e) {
                $('.select').removeClass('is-focused is-opened');
            }).on('afterShow.fb', function(e, instance, slide) {
                _this.initScrollbar();
            });
        };

        _this.updateListeners = function() {
            _this.$select.on('change', function() {
                var active = $(this).val();
                _this.$options.find('a').removeClass('is-active').filter(function() {
                    return $(this).attr('rel') === active;
                }).addClass('is-active');
                _this.$input.text($(this).find('option:selected').text());
                _this.$wrapper.addClass('is-checked');
            });
        };

        _this.init = function() {
            if (_this.$select.hasClass('select__element')) return;

            _this.buildLayout();
            _this.initScrollbar();
            _this.clickListeners();
            _this.updateListeners();
        };

        _this.init();
    });
};

$.fn.phoneMask = function(options) {

    var settings = $.extend(true, {}, {
        masks: {},
        keyHandlers: {},
        eventHandlers: {},
        maskOptions: {},
        debug: true,
        onReady: null
    }, options);

    return this.each(function() {
        var _this = this,
            $this = $(this);

        _this.mask = null;
        _this.handlers = null;

        _this.masks = $.extend(true, {}, {
            '7': '+ 7 (000) 000-00-00',
            '8': '8 (000) 000-00-00'
        }, settings.masks);

        _this.defaultMask = _this.masks[Object.keys(_this.masks)[0]];

        _this.keyHandlers = $.extend(true, {}, {
            '7': {
                keydown: function(e) {
                    if (e.key === '8' && !$(e.target).val()) {
                        _this.updateMask(e.key);
                    };
                }
            },
            '8': {
                keydown: function(e) {
                    if ((e.key === '+' || e.key === '7') && !$(e.target).val()) {
                        _this.updateMask(e.key);
                    };
                }
            }
        }, settings.keyHandlers);

        _this.initMask = function(key) {
            key = key && key.toString() || Object.keys(settings.masks)[0];

            _this.mask = key in _this.masks ? _this.masks[key] : _this.defaultMask;

            _this.initHandlers(key);

            $this.mask(_this.mask, settings.maskOptions).on(_this.handlers);
        };

        _this.initHandlers = function(key) {
            if (_this.handlers) {
                $.each(Object.keys(_this.handlers), function(i, event) {
                    $this.unbind(event, _this.handlers[event]);
                });
            };

            _this.handlers = $.extend(true, {
                paste: function(e) {
                    e.preventDefault();
                },
                focusout: function(e) {
                    if ($(e.target).val().length !== _this.mask.length) {
                        $(e.target).val('');
                    };
                }
            }, _this.keyHandlers[key], settings.eventHandlers);
        };

        _this.destroyMask = function() {
            $this.unmask();
        };

        _this.updateMask = function(key) {
            _this.destroyMask();
            _this.initMask(key);
        };

        _this.checkPluginAccessibility = function(func) {
            if ($().mask) {
                func();
                return;
            };

            if (settings.debug) {
                console.error('jQuery.mask plugin is missing.');
            };
        };

        _this.init = function() {
            _this.checkPluginAccessibility(function() {
                $this.on('keypress', function(e) {
                    if (!$this.val()) {
                        _this.initMask(e.key);

                        if (typeof settings.onReady === 'function') {
                            settings.onReady(_this.mask, _this);
                        };
                    };
                });
            });
        };

        _this.init();
    });
};

// init form listeners
$.fn.initFormListeners = function(options) {

    var settings = $.extend(true, {}, options);

    // toggle focus
    $('input[type="text"], input[type="tel"], input[type="email"], input[type="number"], input[type="date"], textarea').on({
        focus: function() {
            $(this).closest('.form__control').addClass('is-focused');
        },
        blur: function() {
            if ($(this).val() == '') {
                $(this).closest('.form__control').removeClass('is-focused is-checked');
            } else {
                $(this).closest('.form__control').addClass('is-checked');
                $(this).closest('.form__control').removeClass('is-focused');
            }
        }
    });

    // toggle checked
    $('input[type="radio"], input[type="checkbox"]').each(function() {
        var $parent = $(this).closest('.form__control');

        if ($(this).prop('checked')) {
            $(this).attr('data-checked', '');
            $parent.addClass('is-checked');
        };

        if ($(this).attr('type') == 'checkbox') {
            $(this).change(function() {
                if ($(this).prop('checked')) {
                    $(this).attr('data-checked', '');
                    $parent.addClass('is-checked');
                } else {
                    $(this).removeAttr('checked data-checked');
                    $parent.removeClass('is-checked');
                }
            });
        };

        if ($(this).attr('type') == 'radio') {
            $(this).click(function() {
                if ($(this).attr('data-checked') !== '') {
                    $(this).attr('data-checked', '');
                    $parent.addClass('is-checked');
                } else {
                    $(this).prop('checked', false);
                    $(this).removeAttr('data-checked');
                    $parent.removeClass('is-checked');
                };
            });
        };
    });

    // select once
    $('.js-once input').change(function(e) {
        if ($(this).prop('checked') || $(this).attr('checked')) {
            $(this).closest('.js-once').find('input').not($(this)).prop('checked', false).removeAttr('data-checked');
        };
    });

    // file input
    $('input[type="file"]').each(function(i, input) {
        var $parent = $(this).closest('.form__control'),
            $label = $parent.find('label'),
            text = $label.text();

        $(this).on('click', function() {
            $parent.addClass('is-focused');
        }).on('change', function() {
            $parent.removeClass('is-focused');
            if ($(this).val()) {
                $parent.addClass('is-checked');
                $label.text($(this).val().replace(/.*(\/|\\)/, ''));
            } else {
                $parent.removeClass('is-checked');
                $label.text(text);
            };
        });
    });

    // phone mask
    $('input[type="tel"]').phoneMask();

    // custom select
    $('select').customSelect();

};
