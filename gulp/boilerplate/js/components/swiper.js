import $ from 'jquery';
import Swiper, { Navigation, Pagination, Thumbs, Manipulation } from 'swiper';

import Component from './component';
import LazyLoad from './lazyLoad';

import { names } from '../config';
import { mergeDeep } from '../utils/object';

const title = 'Swiper';

const defaults = {};

export default class extends Component {
    constructor(...args) {
        super(title, defaults, ...args);

        const { swiperReady, swipersReady } = names;

        if (!window.swipers) {
            window.swipers = {};

            window[swipersReady] = false;

            $(document).on(swiperReady, this.onReady.bind(this));
        };

        this.init();
    };

    init() {
        const { target, options, parseDataSelector, setup } = this;

        const { attr: thumbsAttr } = parseDataSelector('thumbs');

        const sorted = [...target].sort(el => $(el).attr(thumbsAttr) ? 1 : -1);

        sorted.forEach(el => setup(el, options));

        super.initHandlers({
            click: {
                control: this.onControlClick
            }
        });
    };

    buildLayout(el) {
        $(el).children().wrap('<div class="swiper-slide"></div>');
        $(el).wrapInner('<div class="swiper"><div class="swiper-wrapper"></div></div>');
        $(el).append('<div class="swiper-navigation"><div class="swiper-controls"><a class="swiper-control swiper-control--prev"></a><a class="swiper-control swiper-control--next"></a></div><div class="swiper-pagination"></div></div>');
    };

    onControlClick(e) {
        e.preventDefault();

        const { target: el } = e;
        const { parseDataSelector, getId, getSwiper } = this;

        const { attr: controlAttr } = parseDataSelector('control');

        const id = getId(el);
        const swiper = getSwiper(id);

        if (swiper) {
            if ($(el).attr(controlAttr) === 'prev') {
                swiper.slidePrev();
            };

            if ($(el).attr(controlAttr) === 'next') {
                swiper.slideNext();
            };
        };
    };

    onReady() {
        const { target } = this;
        const { swipers } = window;
        const { swipersReady, checkContentLoaded } = names;

        if (Object.keys(swipers).length === target.length) {
            window[swipersReady] = true;

            $(document).trigger(checkContentLoaded);
        };
    };

    onInit(swiper, id) {
        const { swiperReady } = names;
        const { el } = swiper;

        const lazyLoadEl = el.querySelectorAll('[data-src], [data-background-image]');

        const lazyLoad = new LazyLoad(lazyLoadEl);

        window.swipers[id] = {
            swiper
        };

        $(el).parent().addClass('is-ready');

        $(document).trigger(swiperReady);
    };

    toggleControls = (swiper, id) => {
        const { parseDataSelector } = this;
        const { attr: idAttr } = parseDataSelector('id');
        const { attr: controlAttr } = parseDataSelector('control');

        const $prev = $(`[${idAttr}="${id}"][${controlAttr}="prev"]`);
        const $next = $(`[${idAttr}="${id}"][${controlAttr}="next"]`);

        if (swiper.isBeginning) {
            $prev.addClass('is-disabled');
        } else {
            $prev.removeClass('is-disabled');
        };

        if (swiper.isEnd) {
            $next.addClass('is-disabled');
        } else {
            $next.removeClass('is-disabled');
        };
    };

    setup = (el, options) => {
        const { getId, getParams, buildLayout, onReady } = this;

        const id = getId(el);

        if (window.swipers[id]) {
            return;
        };

        buildLayout(el);

        const params = getParams(el, options);

        const swiperEl = el.children[0];

        const swiper = new Swiper(swiperEl, params);
    };

    getParams = (el, options) => {
        const { getId, parseDataOptions, parseDataSelector, toggleControls, onInit } = this;

        const { attr: thumbsAttr } = parseDataSelector('thumbs');

        const thumbsId = $(el).attr(thumbsAttr);

        const id = getId(el);
        const dataOptions = parseDataOptions(el);
        const params = mergeDeep({}, options, dataOptions);

        const paginationEl = el.querySelector('.swiper-pagination');
        const nextEl = el.querySelector('.swiper-control--next');
        const prevEl = el.querySelector('.swiper-control--prev');

        const clickable = true;

        const pagination = {
            el: paginationEl,
            clickable
        };

        const navigation = {
            nextEl,
            prevEl,
            clickable
        };

        const afterInit = swiper => {
            toggleControls(swiper, id);
            onInit(swiper, id);
        };

        const slideChange = swiper => toggleControls(swiper, id);

        const update = swiper => toggleControls(swiper, id);

        const handlers = {
            afterInit,
            slideChange,
            update
        };

        if (!params.on) {
            params.on = {};
        };

        Object.entries(handlers).forEach(([id, handler]) => {
            const cb = params.on[id];

            if (typeof cb === 'function') {
                params.on[id] = swiper => {
                    handler(swiper);
                    cb(swiper);
                };
            } else {
                params.on[id] = handler;
            };
        });

        params.pagination = pagination;
        params.navigation = navigation;
        params.modules = [Navigation, Pagination, Manipulation];

        if (thumbsId) {
            params.modules.push(Thumbs);

            params.thumbs = {
                swiper: window.swipers[thumbsId].swiper
            };
        };

        return params;
    };

    getSwiper = id => {
        const { swiper } = window.swipers[id];

        return swiper;
    };
};
