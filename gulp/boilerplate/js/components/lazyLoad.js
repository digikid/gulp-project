import $ from 'jquery';
import lozad from 'lozad';

import Component from './component';

const title = 'LazyLoad';

const defaults = {
    rootMargin: '60px 0px',
    cssClasses: {
        loading: 'is-loading',
        loaded: 'is-loaded',
        appeared: 'is-appeared',
        error: 'is-error'
    }
};

export default class extends Component {
    constructor(...args) {
        super(title, defaults, ...args);

        this.init();
    };

    init() {
        const { onLoad } = this;

        const loaded = onLoad.bind(this);

        super.init((el, options) => {
            const { rootMargin } = options;

            const observer = lozad(el, {
                rootMargin,
                loaded
            });

            observer.observe();
        });
    };

    onLoading(el) {
        const { options: { cssClasses: { loading } } } = this;

        $(el).addClass(loading);
    };

    onLoad(el) {
        const {
            onLoaded,
            onError,
            options: {
                cssClasses: {
                    appeared
                }
            }
        } = this;

        const load = onLoaded.bind(this);
        const error = onError.bind(this);

        const src = $(el).attr('data-src') || $(el).attr('data-background-image');

        $(el).addClass(appeared);

        if (src) {
            try {
                $('<img/>').on('load', load).on('error', error).attr('src', src);
            } catch(e) {
                error(el);
            };
        };

        if ($(el).is('video')) {
            load(el);
        };
    };

    onLoaded(el) {
        const { options: { cssClasses: { loading, loaded } } } = this;

        $(el).removeClass(loading).addClass(loaded);
    };

    onError(el) {
        $(el).removeClass(loading).addClass(error);
    };
};