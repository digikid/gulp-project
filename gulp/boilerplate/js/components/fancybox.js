import $ from 'jquery';
import { Fancybox } from '@fancyapps/ui';

import Component from './component';

const title = 'Fancybox';

const l10n = {
    CLOSE: 'Закрыть',
    NEXT: 'Вперед',
    PREV: 'Назад',
    MODAL: 'Вы можете закрыть модальное окно нажатием клавиши ESC',
    ERROR: 'Произошла ошибка, попробуйте позже',
    IMAGE_ERROR: 'Ошибка при загрузке изображения',
    ELEMENT_NOT_FOUND: 'Ошибка при загрузке контента',
    AJAX_NOT_FOUND: 'Элемент не найден',
    AJAX_FORBIDDEN: 'Доступ к элементу запрещен',
    IFRAME_ERROR: 'Ошибка при загрузке страницы',
};

const defaults = {
    autoFocus: false,
    dragToClose: false,
    showClass: 'fancybox-fadeIn',
    hideClass: 'fancybox-fadeOut',
    closeSelector: '[data-close]',
    Thumbs: {
        Carousel: {
            Sync: {
                friction: 0.9,
            }
        }
    },
    Toolbar: {
        display: [
            'counter',
            'zoom',
            'download',
            'close'
        ]
    },
    l10n
};

export default class extends Component {
    constructor(...args) {
        super(title, defaults, ...args);

        this.init();
    };

    validate() {
        const { selector, warning } = this;

        if (typeof selector !== 'string') {
            warning.show('Неверный тип селектора!');

            return false;
        };

        return true;
    };

    init() {
        const { selector, options, close, validate } = this;
        const { closeSelector } = options;

        if (!super.validate(validate)) {
            return;
        };

        Fancybox.bind(selector, options);

        if (closeSelector) {
            $(document).on('click', closeSelector, e => {
                e.preventDefault();

                close();
            });
        };
    };

    close = () => Fancybox.close();

    open = id => {
        const { close, options } = this;

        close();

        Fancybox.show([{
            src: `#modal-${id}`
        }], options);
    };
};