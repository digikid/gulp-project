import $ from 'jquery';

/* if:simplebar */
import SimpleBar from 'simplebar';
/* /if:simplebar */

import randomId from '../../../utils/random/id';

const defaults = {};

export default function(options = {}) {
    const settings = $.extend(true, {}, defaults, options);

    if (!window.selects) {
        window.selects = {};
    };

    return this.each(function() {
        const _this = this;
        const $this = $(this);

        _this.selectId = $this.attr('id') || $this.attr('name') || randomId();
        _this.defaultTitle = $this.attr('data-default');
        _this.defaultValue = '';
        _this.optionsArray = [];

        _this.openDropdown = () => {
            $('.select').not(_this.$root).removeClass('is-active is-focused');

            _this.$root.addClass('is-active is-focused');

            /* if:simplebar */
            _this.updateDropdownScrollbar();
            /* /if:simplebar */
        };

        _this.closeDropdown = () => {
            _this.$root.removeClass('is-active is-focused');
        };

        _this.toggleDropdown = () => {
            if (_this.$root.hasClass('is-active')) {
                _this.closeDropdown();
            } else {
                _this.openDropdown();
            };

            $('.suggests__dropdown').removeClass('is-active');
        };

        _this.buildLayout = () => {
            $this.removeAttr('class').addClass('select__element').wrap('<div class="form__select select"></div>');
            $this.parent().append('<div class="select__input"></div>');
            $this.parent().append('<div class="select__dropdown"></div>');

            _this.$select = $this;
            _this.$root = $this.parent();
            _this.$input = _this.$root.find('.select__input');
            _this.$dropdown = _this.$root.find('.select__dropdown');

            if ($this.attr('readonly')) {
                _this.disable();
            };
        };

        _this.renderItems = () => {
            const $selected = $this.find('option:selected').length ? $this.find('option:selected') : $this.find('option:eq(1)');
            const $disabled = $this.find('option:disabled');

            const { defaultTitle } = _this;

            _this.defaultValue = $selected.val();

            if (defaultTitle) {
                _this.$input.text(defaultTitle);
            };

            $this.find('option').each(function() {
                const title = $(this).text();
                const value = $(this).val();
                const activeClass = $(this).is($selected) ? 'is-active' : '';
                const disabledClass = $(this).is($disabled) ? 'is-disabled' : '';

                _this.optionsArray.push({
                    title,
                    value,
                    disabled: $(this).is($disabled),
                    selected: $(this).is($selected)
                });

                $(`<a class="select__item" data-value="${value}" href="#">${title}</a>`).addClass(`${activeClass} ${disabledClass}`).appendTo(_this.$dropdown);

                if (activeClass && !defaultTitle) {
                    _this.$input.text(title);
                };
            });
        };

        _this.handleOptionsClick = () => {
            _this.$dropdown.children().click(function(e) {
                e.preventDefault();
                e.stopPropagation();

                const value = $(this).attr('data-value');

                if ($(this).hasClass('is-disabled')) return;

                _this.set(value);
                _this.closeDropdown();
            });
        };

        _this.handleInputClick = () => {
            _this.$input.click(e => {
                e.stopPropagation();

                _this.toggleDropdown();
            });
        };

        _this.handleOutsideClick = () => {
            $(document).click(e => {
                if (!$(e.target).closest(_this.$root).length) {
                    _this.closeDropdown();
                };
            });
        };

        /* if:simplebar */
        _this.initDropdownScrollbar = () => {
            _this.scrollbarTimeout = setTimeout(() => {
                _this.$simplebar = new SimpleBar(_this.$dropdown[0], {
                    autoHide: false,
                    timeout: 500
                });

                clearTimeout(_this.scrollbarTimeout);
            }, 1);
        };

        _this.updateDropdownScrollbar = () => {
            if (!_this.$simplebar) return;

            _this.$simplebar.recalculate();
        };

        _this.destroyDropdownScrollbar = () => {
            if (!_this.$simplebar) return;

            _this.$simplebar.unMount();
        };
        /* /if:simplebar */

        _this.update = options => {
            const { defaultValue } = _this;

            if (!options || !Array.isArray(options)) {
                _this.set(defaultValue);

                return;
            };

            /* if:simplebar */
            _this.destroyDropdownScrollbar();
            /* /if:simplebar */

            _this.$select.find('option').remove();
            _this.$dropdown.html('');

            options.forEach(({ title, value, disabled, selected, hidden }) => {
                _this.$select.append(`<option${disabled && ' disabled' || ''}${selected && ' selected' || ''} value="${value}">${title}</option>`);
            });

            _this.renderItems();
            _this.handleOptionsClick();

            /* if:simplebar */
            _this.initDropdownScrollbar();
            /* /if:simplebar */
        };

        _this.enable = () => {
            _this.$select.attr('readonly', false);
            _this.$root.removeClass('is-disabled');
        };

        _this.disable = () => {
            _this.$select.attr('readonly', true);
            _this.$root.addClass('is-disabled');
        };

        _this.set = value => {
            const { defaultValue, optionsArray } = _this;

            const event = ((value === defaultValue) || !value) ? 'reset' : 'change';

            const option = optionsArray.find(option => {
                const v = (value === '' && value !== defaultValue) ? defaultValue : value;

                return option.value === v;
            });

            if (!option) return;

            const { title } = option;

            _this.$input.html(title);
            _this.$select.val(value).triggerNative(event);
            _this.$dropdown.find(`.select__item[data-value="${value}"]`).addClass('is-active').siblings().removeClass('is-active');

            if (value === defaultValue) {
                _this.$root.removeClass('is-selected');
            } else {
                _this.$root.addClass('is-selected');
            };
        };

        _this.init = () => {
            const { onReady } = settings;
            const { selectId } = _this;

            _this.buildLayout();
            _this.renderItems();
            _this.handleOptionsClick();
            _this.handleInputClick();
            _this.handleOutsideClick();

            /* if:simplebar */
            _this.initDropdownScrollbar();
            /* /if:simplebar */

            if (selectId) {
                window.selects[selectId] = _this;
            };
        };

        _this.init();
    });
};
