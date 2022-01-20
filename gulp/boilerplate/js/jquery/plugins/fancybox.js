import $ from 'jquery';
import { Fancybox } from '@fancyapps/ui';

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

export default function(options = {}) {
    const settings = $.extend(true, {}, defaults, options);
    const selector = $(this).data('selector');

    const { closeSelector } = settings;

    $.settings.fancybox = settings;

    Fancybox.bind(selector, settings);

    $(closeSelector).click(e => {
        e.preventDefault();

        Fancybox.close();
    });

    return this;
};