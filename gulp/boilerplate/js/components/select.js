import $ from 'jquery';

/* if:simplebar */
import SimpleBar from 'simplebar';
/* /if:simplebar */

import Component from './component';

import { triggerNative } from '../utils/event';
import { id as randomId } from '../utils/random';

const title = 'Select';

const defaults = {
    simplebar: {
        autoHide: false,
        timeout: 500
    }
};

export default class extends Component {
    constructor(...args) {
        super(title, defaults, ...args);

        const attrs = [
            'id',
            'default',
            'root',
            'element',
            'input',
            'dropdown',
            'item',
            'value',
            'checkbox',
            'label'
        ];

        this.attrs = attrs.reduce((acc, id) => {
            acc[id] = this.parseDataSelector(id).attr;

            return acc;
        }, {});

        this.init();
    };

    init() {
        const { getId, buildLayout, bindMethods/* if:simplebar */, initScrollbar/* /if:simplebar */ } = this;

        if (!window.selects) {
            window.selects = {};
        };

        super.init((el, options) => {
            const id = getId(el);

            if (window.selects[id]) {
                return;
            };

            buildLayout.call(this, el);
            bindMethods.call(this, el);

            /* if:simplebar */
            initScrollbar.call(this, el);
            /* /if:simplebar */

            window.selects[id] = el;
        });

        super.initHandlers({
            click: {
                item: this.onItemClick,
                input: this.onInputClick,
                document: this.onDocumentClick
            },
            change: {
                checkbox: this.onCheckboxChange
            }
        });
    };

    buildLayout(el) {
        const { attrs, disable, getId, getElements, getDefaults, parseDataSelector, renderItems } = this;

        const id = getId(el);

        const { title } = getDefaults(el);

        if (!$(el).attr(attrs.id)) {
            $(el).attr(attrs.id, id);
        };

        $(el).removeAttr('class').addClass('select__element').attr(attrs.element, '').wrap(`<div class="form__select select" ${attrs.root}></div>`);
        $(el).parent().append(`<div class="select__input" ${attrs.input}></div>`);
        $(el).parent().append(`<div class="select__dropdown" ${attrs.dropdown}></div>`);

        const { $input, $dropdown } = getElements(el);

        const options = [];

        $(el).find('option').each(function() {
            const title = $(this).text();
            const value = $(this).val();
            const selected = $(this).is('option:selected');
            const disabled = $(this).is('option:disabled');
            const hidden = $(this).attr('hidden');

            options.push({
                title,
                value,
                selected,
                disabled,
                hidden
            });
        });

        $input.text(title);

        renderItems.call(this, el, options);

        if ($(el).attr('readonly')) {
            disable(el);
        };
    };

    renderItems(el, options = []) {
        if (!options || !Array.isArray(options)) {
            return;
        };

        const { attrs, getElements, getAttribute } = this;

        const { $dropdown } = getElements(el);

        const multiple = getAttribute(el, 'multiple');

        options.forEach(option => {
            const { title, value, selected, disabled, hidden } = option;

            const id = randomId();

            const activeClass = selected ? 'is-active' : '';
            const disabledClass = disabled ? 'is-disabled' : '';
            const hiddenClass = hidden ? 'is-hidden' : '';

            const defaultHtml = `<a class="select__item" href="#" ${attrs.item} ${attrs.value}="${value}">${title}</a>`;
            const multipleHtml = `<div class="select__item" ${attrs.item}><input type="checkbox"  name="${id}" id="${id}" value="${value}" ${attrs.checkbox}><label for="${id}" ${attrs.label}>${title}</label></div>`

            const html = multiple ? multipleHtml : defaultHtml;

            $(html).addClass(`${activeClass} ${disabledClass} ${hiddenClass}`).appendTo($dropdown);
        });

        $(el).data('options', options);
    };

    bindMethods(el) {
        const { set, reset, enable, disable, update } = this;

        const methods = {
            enable,
            disable,
            set,
            reset,
            update
        };

        Object.entries(methods).forEach(([id, cb]) => {
            el[id] = (...args) => cb(el, ...args);
        });
    };

    onCheckboxChange(e) {
        const { target: el } = e;
        const { attrs, getElements } = this;
        const { selects } = window;

        const { $element, $dropdown } = getElements(el);

        const id = $element.attr(attrs.id);
        const checked = [];

        $dropdown.find(`[${attrs.checkbox}]:checked`).each(function() {
            const value = $(this).val();

            checked.push(value);
        });

        if (selects[id]) {
            selects[id].set(checked);
        };
    };

    onItemClick(e) {
        const { target: el } = e;
        const { attrs, getElements, getAttribute, closeDropdown } = this;
        const { selects } = window;

        const { $element } = getElements(el);

        const multiple = getAttribute(el, 'multiple');

        e.stopPropagation();

        if (!multiple) {
            e.preventDefault();

            const id = $element.attr(attrs.id);
            const value = $(el).attr(attrs.value);

            if (selects[id]) {
                selects[id].set(value);
            };

            closeDropdown(el);
        };
    };

    onInputClick(e) {
        const { target: el } = e;
        const { toggleDropdown } = this;

        e.preventDefault();
        e.stopPropagation();

        toggleDropdown(el);
    };

    onDocumentClick(e) {
        const { attrs } = this;

        $(`[${attrs.root}]`).removeClass('is-active is-focused');
    };

    openDropdown = el => {
        const { attrs, getElements } = this;
        const { $root } = getElements(el);

        $(`[${attrs.root}]`).not($root).removeClass('is-active is-focused');

        $root.addClass('is-active is-focused');
    };

    closeDropdown = el => {
        const { getElements } = this;
        const { $root } = getElements(el);

        $root.removeClass('is-active is-focused');
    };

    toggleDropdown = el => {
        const { getElements, closeDropdown, openDropdown } = this;
        const { $root } = getElements(el);

        if ($root.hasClass('is-active')) {
            closeDropdown(el);
        } else {
            openDropdown(el);
        };
    };

    /* if:simplebar */
    getScrollbar = el => {
        const { getElements } = this;

        const { $dropdown } = getElements(el);

        const scrollbar = $dropdown.data('scrollbar');

        return scrollbar;
    };

    initScrollbar = el => {
        const { getElements, options: { simplebar: params } } = this;

        const { $dropdown } = getElements(el);

        const timeout = setTimeout(() => {
            const scrollbar = new SimpleBar($dropdown[0], params);

            $dropdown.data('scrollbar', scrollbar);

            clearTimeout(timeout);
        }, 1);
    };

    updateScrollbar = el => {
        const { getScrollbar } = this;

        const scrollbar = getScrollbar(el);

        if (scrollbar) {
            scrollbar.recalculate();
        };
    };

    destroyScrollbar = el => {
        const { getElements, getScrollbar } = this;

        const { $dropdown } = getElements(el);

        const scrollbar = getScrollbar(el);

        if (scrollbar) {
            scrollbar.unMount();
        };
    };
    /* /if:simplebar */

    getElements = el => {
        const { attrs } = this;

        const $root = $(el).is(`[${attrs.root}]`) ? $(el) : $(el).closest(`[${attrs.root}]`);
        const $element = $(el).is('select') ? $(el) : $root.find(`[${attrs.element}]`);
        const $input = $root.find(`[${attrs.input}]`);
        const $dropdown = $root.find(`[${attrs.dropdown}]`);

        return {
            $root,
            $element,
            $input,
            $dropdown
        };
    };

    getDefaults = el => {
        const { attrs, getTitleByValue } = this;

        const options = Array.from(el.querySelectorAll('option'));
        const defaultOption = options.find(option => option.defaultSelected);
        const firstOption = options.find(option => $(option).not(':disabled'));

        const { value } = (defaultOption || firstOption);

        const title = $(el).attr(attrs.default) || getTitleByValue(el, value);

        return {
            value,
            title
        };
    };

    getAttribute = (el, attr) => {
        const { getElements } = this;
        const { $element } = getElements(el);

        return $element.attr(attr);
    };

    getTitleByValue = (el, value) => {
        const options = Array.from(el.querySelectorAll('option'));
        const option = options.find(option => (option.value === value));

        return option ? $(option).text() : '';
    };

    getValueByTitle = (el, title) => {
        const option = Array.from(el.querySelectorAll('option')).find(option => $(option).text() === title);

        return option ? option.value : '';
    };

    enable = el => {
        const { attrs } = this;

        $(el).attr('readonly', false).closest(`[${attrs.root}]`).removeClass('is-disabled');
    };

    disable = el => {
        const { attrs } = this;

        $(el).attr('readonly', true).closest(`[${attrs.root}]`).addClass('is-disabled');
    };

    set = (el, value) => {
        const { attrs, getElements, getAttribute, getTitleByValue, warning } = this;

        const currentValue = $(el).val();
        const multiple = getAttribute(el, 'multiple');

        if (!multiple && Array.isArray(value)) {
            warning.show('Некорректный тип значения');

            return;
        };

        if (value !== currentValue) {
            const { $input, $element, $dropdown, $root } = getElements(el);

            const options = Array.isArray(value) ? value : [value];

            const titles = [];
            const values = [];

            options.forEach(option => {
                const title = getTitleByValue(el, option);

                titles.push(title);
                values.push(option);
            });

            const updatedTitle = (titles.length === 1) ? titles[0] : titles.join(', ');
            const updatedValue = (values.length === 1) ? values[0] : values;

            $dropdown.find(`[${attrs.item}]`).each(function() {
                const value = multiple ? $(this).find(`[${attrs.checkbox}]`).val() : $(this).attr(attrs.value);

                if (options.includes(value)) {
                    $(this).addClass('is-active');
                } else {
                    $(this).removeClass('is-active');
                };
            });

            $input.text(updatedTitle);
            $element.val(updatedValue).triggerNative('change');
            $root.addClass('is-selected');
        };
    };

    reset = el => {
        const { attrs, getDefaults, getElements } = this;
        const { $input, $element, $dropdown, $root } = getElements(el);

        const { title, value } = getDefaults(el);

        $dropdown.find(`[${attrs.item}]`).removeClass('is-active').find(`[${attrs.checkbox}]`).prop('checked', false);
        $input.text(title);
        $element.val(value).triggerNative('reset');
        $root.removeClass('is-selected');
    };

    update = (el, options = []) => {
        if (!options || !Array.isArray(options)) {
            return;
        };

        const { getElements, getDefaults, renderItems/* if:simplebar */, initScrollbar, destroyScrollbar/* /if:simplebar */ } = this;

        const { $element, $dropdown, $input } = getElements(el);

        /* if:simplebar */
        destroyScrollbar(el);
        /* /if:simplebar */

        $element.find('option').remove();
        $dropdown.html('');

        options.forEach(option => {
            const { title, value } = option;

            const attrs = ['selected', 'disabled', 'hidden'].reduce((acc, attr) => acc + (option[attr] ? ` ${attr}` : ''), '');

            $element.append(`<option${attrs} value="${value}">${title}</option>`);
        });

        const { title } = getDefaults(el);

        $input.text(title);

        renderItems.call(this, el, options);

        /* if:simplebar */
        initScrollbar(el);
        /* /if:simplebar */
    };
};