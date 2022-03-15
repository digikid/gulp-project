import $ from 'jquery';
import AirDatepicker from 'air-datepicker';

import Component from './component';

import { disable as disableScroll, enable as enableScroll } from '../utils/scroll';

const title = 'Datepicker';

const defaults = {
    autoClose: true,
    minDate: new Date()
};

export default class extends Component {
    constructor(...args) {
        super(title, defaults, ...args);

        this.init();
    };

    init() {
        const { onShow, onHide } = this;

        super.init((el, options) => {
            new AirDatepicker(el, {
                ...options,
                onShow,
                onHide
            });
        });
    };

    onShow(isFinished) {
        if (isFinished) {
            disableScroll();
        };
    };

    onHide(isFinished) {
        if (isFinished) {
            enableScroll();
        };
    };
};