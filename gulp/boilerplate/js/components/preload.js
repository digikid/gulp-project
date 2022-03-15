import $ from 'jquery';
import Component from './component';

import { names } from '../config';
import { isObjectEmpty } from '../utils/object';

const title = 'Preload';

const defaults = {
    cssClass: 'is-ready',
    limit: 0,
    onReady: null
};

export default class extends Component {
    constructor(...args) {
        super(title, defaults, ...args);

        this.init();
    };

    init() {
        const { target, check, loaded, load, force, options: { cssClass } } = this;
        const { contentLoaded, checkContentLoaded } = names;

        if (target.some(el => $(el).hasClass(cssClass))) {
            return;
        };

        $(document).on({
            [contentLoaded]: loaded,
            [checkContentLoaded]: check
        });

        if (document.readyState === 'complete') {
            $(document).trigger(contentLoaded);
        } else {
            window.onload = load;
        };

        force();
    };

    check = () => {
        const { ready } = this;
        const { swipers } = window;
        const { contentLoaded, swipersReady } = names;

        if (!swipers || isObjectEmpty(swipers)) {
            window[swipersReady] = true;
        };

        if (window[contentLoaded] && window[swipersReady]) {
            ready();
        };
    };

    loaded = () => {
        const { contentLoaded, checkContentLoaded } = names;

        window[contentLoaded] = true;

        $(document).trigger(checkContentLoaded);
    };

    load = () => {
        const { onloadTimeout, contentLoaded } = names;

        if (window[onloadTimeout]) {
            clearTimeout(window[onloadTimeout]);
        };

        window[onloadTimeout] = setTimeout(() => {
            $(document).trigger(contentLoaded);
        }, 0);
    };

    force = () => {
        const { ready, options: { limit } } = this;
        const { forceTimeout } = names;

        if (!limit) return;

        window[forceTimeout] = setTimeout(() => {
            if (window[forceTimeout]) {
                clearTimeout(window[forceTimeout]);
            };

            ready();
        }, limit);
    };

    ready = () => {
        const { target, options: { cssClass, onReady } } = this;

        if (typeof onReady === 'function') {
            onReady.call(this, this);
        };

        if (Array.isArray(target)) {
            target.forEach(el => $(target).addClass(cssClass));
        } else {
            $(target).addClass(cssClass);
        };
    };
};