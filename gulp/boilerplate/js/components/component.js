import $ from 'jquery';

import Warning from './warning';

import { id as randomId } from '../utils/random';
import { isObject, mergeDeep } from '../utils/object';
import { toCamelCase } from '../utils/string';

export default class Component {
    static components = {};
    static attachedHandlers = {};

    constructor(title, defaults, ...args) {
        const [selector, params = {}] = args;

        const warning = new Warning(title);

        if (!this.isArgumentsValid(args, warning)) {
            return;
        };

        const id = toCamelCase(title);
        const options = mergeDeep({}, defaults, params);
        const target = this.getTarget(selector);

        this.id = id;
        this.title = title;
        this.selector = selector;
        this.defaults = defaults;
        this.params = params;
        this.options = options;
        this.target = target;
        this.warning = warning;

        if (!Component.components[id]) {
            Component.components[id] = this;
        };
    };

    init(cb) {
        const { target, selector, options } = this;

        if (typeof cb === 'function') {
            target.forEach(el => cb.call(this, el, options));
        };
    };

    isSelectorValid(selector) {
        const selectorTypes = [
            HTMLElement,
            $
        ];

        const isString = (typeof selector === 'string');
        const isNodeList = NodeList.prototype.isPrototypeOf(selector);
        const isValidType = selectorTypes.reduce((acc, type) => (acc || (selector instanceof type)));

        return (isString || isNodeList || isValidType);
    };

    isArgumentsValid(args, warning) {
        const { isSelectorValid } = this;

        const [selector, params] = args;

        const selectorTypes = [
            HTMLElement,
            $
        ];

        if (!selector) {
            warning.show('Не определен селектор');

            return;
        };

        if (!isSelectorValid(selector)) {
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

        if (typeof cb !== 'function') {
            return;
        };

        return cb.call({
            selector,
            params,
            warning
        });
    };

    initHandlers(handlers = {}) {
        const _that = this;

        const { id, parseDataSelector } = this;

        const outside = ['document', 'body', 'html', 'outside'];

        if (Component.attachedHandlers[id]) {
            return;
        };

        Object.entries(handlers).forEach(([events, handlers]) => {
            events.split(' ').forEach((event) => {
                Object.entries(handlers).forEach(([id, handler]) => {
                    if ((typeof handler !== 'function')) {
                        return;
                    };

                    const { selector } = parseDataSelector(id);

                    const cb = async function(e) {
                        await handler.call(_that, e);
                    };

                    const params = outside.includes(id) ? [event, cb] : [event, selector, cb];

                    $(document).on(...params);
                });
            });
        });

        Component.attachedHandlers[id] = handlers;
    };

    getOptions = (id, key = 'options') => {
        if (!Component.components[id]) {
            return {};
        };

        return Component.components[id][key];
    };

    getId = el => {
        const { parseDataSelector, getElements } = this;

        const { $root } = getElements(el);

        const { attr } = parseDataSelector();
        const { attr: idAttr } = parseDataSelector('id');

        const attrs = [idAttr, attr, 'name', 'id'];

        return attrs.reduce((acc, attr) => acc || (el ? $(el).attr(attr) : false) || $root.attr(attr), false) || randomId();
    };

    getElement = (el, id = 'root') => {
        const { parseDataSelector } = this;

        const element = {};

        const { selector } = parseDataSelector(id);
        const { selector: rootSelector } = parseDataSelector();

        const $el = el ? $(el) : $(rootSelector);
        const $root = $el.is(rootSelector) ? $el : $el.closest(rootSelector);
        const $node = (id === 'root') ? $root : $root.find(selector);

        element[`$${id}`] = $node;
        element[id] = $node.get();

        return element;
    };

    getElements = (el, ids = []) => {
        const { getElement } = this;

        const initial = getElement();

        if (!el || !ids.length || !Array.isArray(ids)) {
            return initial;
        };

        return ids.filter(id => (id !== 'root')).reduce((acc, id) => ({
            ...acc,
            ...getElement(el, id)
        }), initial);
    };

    getTarget = selector => {
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

        return [];
    };

    getDataSelector = selector => {
        const { getTarget } = this;

        const target = getTarget(selector);
        const dataKeys = Object.keys(target[0].dataset);
        const data = dataKeys.length ? `[data-${dataKeys[0]}]` : null;

        return data;
    };

    parseDataSelector = id => {
        const { selector: _selector, getDataSelector } = this;

        const s = (typeof _selector === 'string') ? _selector : getDataSelector(_selector);
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
