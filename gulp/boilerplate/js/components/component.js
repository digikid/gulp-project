import $ from 'jquery';

import Warning from './warning';

import { isObject, mergeDeep } from '../utils/object';

export default class Component {
    constructor(title, defaults, ...args) {
        const [selector, params = {}] = args;

        if (!this.check(args)) {
            return;
        };

        const options = mergeDeep(defaults, params);

        const target = this.getTarget(selector);

        const warning = new Warning(title);

        this.title = title;
        this.selector = selector;
        this.defaults = defaults;
        this.params = params;
        this.options = options;
        this.target = target;
        this.warning = warning;
    };

    init(cb) {
        const { target, selector, options } = this;

        if (typeof cb === 'function') {
            target.forEach(el => cb.call(this, el, options));
        };
    };

    check(args) {
        const { warning } = this;

        const [selector, params] = args;

        const selectorTypes = [
            HTMLElement,
            $
        ];

        const isTypeValid = selectorTypes.reduce((acc, type) => {
            return acc && ((typeof selector === 'string') || NodeList.prototype.isPrototypeOf(selector) || (selector instanceof type));
        }, true);

        if (!selector) {
            warning.show('Не определен селектор');

            return;
        };

        if (!isTypeValid) {
            warning.show('Неверный тип селектора');

            return;
        };

        if (params && !isObject(params)) {
            warning.show('Неверный формат параметров');

            return;
        };

        return true;
    };

    validate(cb) {
        const { selector, params, warning } = this;

        if (cb && typeof cb === 'function') {
            return cb.call({
                selector,
                params,
                warning
            });
        };
    };

    getTarget(selector) {
        if (typeof selector === 'string') {
            return Array.from(document.querySelectorAll(selector));
        };

        if (NodeList.prototype.isPrototypeOf(selector)) {
            return Array.from(selector);
        };

        if (selector instanceof $) {
            return selector.get();
        };

        if (selector instanceof HTMLElement) {
            return [selector];
        };
    };

    parseDataSelector = id => {
        const { selector: s } = this;

        const reg = /\[|\]|data-/gi;

        if ((typeof s === 'string') && reg.test(s)) {
            const base = s.replace(reg, '');
            const attr = id ? `data-${base}-${id}` : `data-${base}`;
            const selector = `[${attr}]`;

            return {
                base,
                attr,
                selector
            };
        } else {
            throw new Error('Невалидный селектор');
        };
    };

    parseDataOptions = el => {
        const { parseDataSelector } = this;

        const { attr } = parseDataSelector.call(this, 'options');

        const str = $(el).attr(attr);

        try {
            JSON.parse(str);
        } catch (e) {
            return {};
        };

        return JSON.parse(str);
    };
};