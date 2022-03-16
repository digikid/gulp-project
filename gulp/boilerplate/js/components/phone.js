import $ from 'jquery';
import 'jquery-mask-plugin';

import Component from './component';

import { mergeDeep } from '../utils/object';

const title = 'Phone';

const defaults = {
    masks: {},
    keyHandlers: {},
    maskOptions: {}
};

export default class extends Component {
    constructor(...args) {
        super(title, defaults, ...args);

        const masks = mergeDeep({}, {
            '7': '+ 7 (000) 000-00-00',
            '8': '8 (000) 000-00-00'
        }, this.options.masks);

        const keyHandlers = mergeDeep({}, Object.keys(masks).reduce((acc, key) => {
            const keydown = e => this.handleKey(key).bind(this);

            acc[key] = {
                keydown
            };

            return acc;
        }, {}), this.options.keyHandlers);

        this.mask = null;
        this.masks = masks;
        this.keyHandlers = keyHandlers;

        this.init();
    };

    init() {
        super.init((el, options) => {
            const { update } = this;

            $(el).on('keypress', update.bind(this));
        });
    };

    update(e) {
        const { masks, keyHandlers, options: { maskOptions } } = this;
        const { key, target: el } = e;

        if (el.value) {
            return;
        };

        const defaultMask = masks[Object.keys(masks)[0]];

        const mask = this.mask = (key in masks) ? masks[key] : defaultMask;

        const paste = e => e.preventDefault();

        const focusout = e => {
            const { value } = e.target;

            if (value.length !== this.mask.length) {
                e.target.value = '';
            };
        };

        const handlers = {
            paste,
            focusout,
            ...keyHandlers[key]
        };

        Object.keys(handlers).forEach(id => $(el).unbind(id, handlers[id]));

        $(el).mask(mask, maskOptions).on(handlers);
    };

    handleKey(key) {
        const { update } = this;

        return e => {
            if (e.target.value) {
                return;
            };

            if ((key === '7') && (e.key === '8')) {
                update(e);
            };

            if ((key === 8) && (e.key === '+' || e.key === '7')) {
                update(e);
            };
        };
    };
};