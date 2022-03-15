import $ from 'jquery';
import Swiper, { Navigation, Pagination, Thumbs } from 'swiper';

import Component from './component';
import LazyLoad from './lazyLoad';

import { names } from '../config';
import { mergeDeep } from '../utils/object';
import { id as randomId } from '../utils/random';

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
        const { target, options, parseDataSelector, getId, getParams, buildLayout, onReady } = this;

        const { attr: thumbsAttr } = parseDataSelector('thumbs');

        const sorted = [...target].sort(el => $(el).attr(thumbsAttr) ? 1 : -1);

        sorted.forEach(el => {
            const id = getId(el);

            if (window.swipers[id]) {
                return;
            };

            buildLayout(el);

            const params = getParams(el, options);

            const swiperEl = el.children[0];

            const swiper = new Swiper(swiperEl, params);
        });
    };

    buildLayout(el) {
        $(el).children().wrap('<div class="swiper-slide"></div>');
        $(el).wrapInner('<div class="swiper"><div class="swiper-wrapper"></div></div>');
        $(el).append('<div class="swiper-navigation"><div class="swiper-controls"><a class="swiper-control swiper-control--prev"></a><a class="swiper-control swiper-control--next"></a></div><div class="swiper-pagination"></div></div>');
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

    getId = el => {
        const { parseDataSelector } = this;

        const { attr } = parseDataSelector();
        const { attr: idAttr } = parseDataSelector('id');

        const attrs = [idAttr, attr, 'id'];

        return attrs.reduce((acc, attr) => acc || $(el).attr(attr), '') || randomId();
    };

    getParams = (el, options) => {
        const { getId, parseDataOptions, parseDataSelector, onInit } = this;

        const { attr: thumbsAttr } = parseDataSelector('thumbs');

        const thumbsId = $(el).attr(thumbsAttr);

        const id = getId(el);
        const dataOptions = parseDataOptions(el);
        const params = mergeDeep(options, dataOptions);

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

        const afterInit = swiper => onInit(swiper, id);

        params.pagination = pagination;
        params.navigation = navigation;
        params.modules = [Navigation, Pagination];

        if (thumbsId) {
            params.modules.push(Thumbs);

            params.thumbs = {
                swiper: window.swipers[thumbsId].swiper
            };
        };

        params.on = {
            afterInit
        };

        return params;
    };

    getSwiper = id => {
        const { swiper } = window.swipers[id];

        return swiper;
    };
};