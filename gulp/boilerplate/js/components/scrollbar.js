import SimpleBar from 'simplebar';

import Component from './component';

const title = 'Scrollbar';

const defaults = {
    timeout: 500
};

export default class extends Component {
    constructor(...args) {
        super(title, defaults, ...args);

        this.init();
    };

    init = () => {
        super.init((el, options) => new SimpleBar(el, options));
    };
};