import $ from 'jquery';
import tippy from 'tippy.js';

import Component from './component';

const title = 'Tooltip';

const defaults = {
    theme: 'light'
};

export default class extends Component {
    constructor(...args) {
        super(title, defaults, ...args);

        this.init();
    };

    init() {
        const { parseDataSelector } = this;

        const { attr } = parseDataSelector();

        super.init((el, options) => {
            const content = $(el).attr(attr) || $(el).attr('aria-label');

            if (content) {
                new tippy(el, {
                    content,
                    ...options
                });
            };
        });
    };
};