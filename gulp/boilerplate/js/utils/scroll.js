import { preventEvent, preventKeyEvent } from './event';

const params = {
    passive: false
};

const windowEvents = [
    'DOMMouseScroll',
    'onwheel',
    'onmousewheel',
    'ontouchmove'
];

const documentEvents = [
    'wheel',
    'onmousewheel',
    'onkeydown'
];

const scrollKeys = [32, 33, 34, 35, 37, 38, 39, 40];

const preventScrollKeyEvent = e => preventKeyEvent(e, scrollKeys);

export const enable = () => {
    if ('removeEventListener' in window) {
        windowEvents.forEach(event => {
            const opts = (event === 'DOMMouseScroll' ? false : params);

            window.removeEventListener(event, preventEvent, opts);
        });
    };

    if ('removeEventListener' in document) {
        documentEvents.forEach(event => {
            const handler = (event === 'onkeydown' ? preventScrollKeyEvent : preventEvent);

            document.removeEventListener(event, handler, params);
        });
    };
};

export const disable = () => {
    if ('addEventListener' in window) {
        windowEvents.forEach(event => {
            const opts = (event === 'DOMMouseScroll' ? false : params);

            window.addEventListener(event, preventEvent, opts);
        });
    };

    if ('addEventListener' in document) {
        documentEvents.forEach(event => {
            const handler = (event === 'onkeydown' ? preventScrollKeyEvent : preventEvent);

            document.addEventListener(event, handler, params);
        });
    };
};