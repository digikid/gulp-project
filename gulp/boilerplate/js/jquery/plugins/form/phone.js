import $ from 'jquery';
import 'jquery-mask-plugin';

const defaults = {
    masks: {},
    keyHandlers: {},
    eventHandlers: {},
    maskOptions: {}
};

export default function(options = {}) {
    const settings = $.extend(true, {}, defaults, options);

    return this.each(function() {
        const _this = this;
        const $this = $(this);

        const {
            masks,
            maskOptions,
            keyHandlers,
            eventHandlers
        } = settings;

        _this.mask = null;
        _this.handlers = {};

        _this.masks = {
            '7': '+ 7 (000) 000-00-00',
            '8': '8 (000) 000-00-00',
            ...masks
        };

        _this.defaultMask = _this.masks[
            Object.keys(_this.masks)[0]
        ];

        _this.keyHandlers = {
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
            },
            ...keyHandlers
        };

        _this.initMask = k => {
            const key = k && k.toString() || Object.keys(masks)[0];

            _this.mask = key in _this.masks ? _this.masks[key] : _this.defaultMask;

            _this.initHandlers(key);

            $this.mask(_this.mask, maskOptions).on(_this.handlers);
        };

        _this.initHandlers = key => {
            Object.keys(_this.handlers).forEach(handler => {
                $this.unbind(handler, _this.handlers[handler]);
            });

            _this.handlers = {
                paste: function(e) {
                    e.preventDefault();
                },
                focusout: function(e) {
                    if ($(e.target).val().length !== _this.mask.length) {
                        $(e.target).val('');
                    };
                },
                ..._this.keyHandlers[key],
                ...eventHandlers
            };
        };

        _this.destroyMask = function() {
            $this.unmask();
        };

        _this.updateMask = function(key) {
            _this.destroyMask();
            _this.initMask(key);
        };

        _this.init = function() {
            $this.on('keypress', e => {
                const { key } = e;
                const value = $(e.target).val();

                if (value) return;

                _this.initMask(e.key);
            });
        };

        _this.init();
    });
};